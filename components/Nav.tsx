// components/Nav.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FiSettings, FiChevronDown, FiChevronUp } from "react-icons/fi";

export interface NavItem {
  id: number | string;
  title: string;
  target?: string;
  visible?: boolean;
  order?: number;
  children?: NavItem[];
}

interface DragItem {
  id: number | string;
  index: number;
}

// --- Helper: Fetch with Retry ---
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number = 3,
  delay: number = 500
): Promise<Response> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`Server responded with status ${res.status}`);
    }
    return res;
  } catch (err) {
    if (retries > 0) {
      console.warn(`Retrying request. Retries left: ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay);
    } else {
      throw err;
    }
  }
}

// --- NavItemComponent ---
// This component displays the nav item content (title or input for editing) and handles drag-and-drop.
interface NavItemComponentProps {
  item: NavItem;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  editMode: boolean;
  updateTitle: (id: number | string, newTitle: string) => void;
}

const NavItemComponent = ({
  item,
  index,
  moveItem,
  editMode,
  updateTitle,
}: NavItemComponentProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: "NAV_ITEM",
    item: { id: item.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "NAV_ITEM",
    hover(dragged: DragItem) {
      if (dragged.index !== index) {
        moveItem(dragged.index, index);
        dragged.index = index;
      }
    },
  });

  // Determine target route: Dashboard routes to "/", everything else to "/empty"
  const href = item.title === "Dashboard" ? "/" : "/empty";

  return (
    <div
      ref={(node) => {
        drag(drop(node));
      }}
      className={`p-2 border rounded mb-2 bg-white flex items-center justify-between ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {editMode ? (
        <input
          type="text"
          value={item.title}
          onChange={(e) => updateTitle(item.id, e.target.value)}
          className="border p-1 w-full"
        />
      ) : item.children && item.children.length > 0 ? (
        <span>{item.title}</span>
      ) : (
        // Wrap the item title with a Link so that clicking navigates appropriately.
        <Link href={href}>
          <span>{item.title}</span>
        </Link>
      )}
    </div>
  );
};

// --- NavItemWrapper ---
// Wraps each nav item and manages expand/collapse if children exist.
interface NavItemWrapperProps {
  item: NavItem;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  editMode: boolean;
  updateTitle: (id: number | string, newTitle: string) => void;
  onChange: (newItem: NavItem, index: number) => void;
  apiUrl: string;
}

const NavItemWrapper = ({
  item,
  index,
  moveItem,
  editMode,
  updateTitle,
  onChange,
  apiUrl,
}: NavItemWrapperProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div>
      <div className="flex items-center">
        <NavItemComponent
          item={item}
          index={index}
          moveItem={moveItem}
          editMode={editMode}
          updateTitle={updateTitle}
        />
        {item.children && item.children.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        )}
      </div>
      {expanded && item.children && item.children.length > 0 && (
        <div className="pl-4">
          <NavList
            items={item.children}
            level={1}
            onChange={(newChildren) => {
              onChange({ ...item, children: newChildren }, index);
            }}
            editMode={editMode}
            apiUrl={apiUrl}
          />
        </div>
      )}
    </div>
  );
};

// --- NavList: Recursive Component for Nested Items ---
interface NavListProps {
  items: NavItem[];
  level: number;
  onChange: (newItems: NavItem[]) => void;
  editMode: boolean;
  apiUrl: string;
}

const NavList = ({ items, onChange, editMode, apiUrl }: NavListProps) => {
  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    onChange(newItems);

    fetchWithRetry(`${apiUrl}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: movedItem.id, from: fromIndex, to: toIndex }),
    })
      .then(() => {
        // Successfully tracked
      })
      .catch((err) => console.error("Tracking error after retries:", err));
  };

  const updateTitleLocal = (id: number | string, newTitle: string) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, title: newTitle } : item
    );
    onChange(newItems);
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={item.id} className="mb-2">
          <NavItemWrapper
            item={item}
            index={index}
            moveItem={moveItem}
            editMode={editMode}
            updateTitle={updateTitleLocal}
            onChange={(newItem, idx) => {
              const newItems = [...items];
              newItems[idx] = newItem;
              onChange(newItems);
            }}
            apiUrl={apiUrl}
          />
        </div>
      ))}
    </div>
  );
};

// --- Main Nav Component ---
export default function Nav() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

  useEffect(() => {
    setMounted(true);
    fetch(`${API_URL}/nav`)
      .then((res) => res.text())
      .then((text) => {
        const data: NavItem[] = text ? JSON.parse(text) : [];
        setNavItems(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      })
      .catch((err) => console.error("Error fetching nav:", err));
  }, [API_URL]);

  const saveNav = () => {
    const updatedNav = navItems.map((item, index) => ({
      ...item,
      order: index,
    }));
    fetch(`${API_URL}/nav`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedNav),
    })
      .then((res) => res.text())
      .then(() => {
        setEditMode(false);
      })
      .catch((err) => console.error("Error saving nav:", err));
  };

  const discardChanges = () => {
    fetch(`${API_URL}/nav`)
      .then((res) => res.text())
      .then((text) => {
        const data: NavItem[] = text ? JSON.parse(text) : [];
        setNavItems(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
        setEditMode(false);
      })
      .catch((err) => console.error("Error discarding changes:", err));
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className="p-2 border rounded"
          >
            <FiSettings size={20} />
          </button>
        </div>
        <NavList
          items={navItems}
          level={0}
          onChange={setNavItems}
          editMode={editMode}
          apiUrl={API_URL}
        />
        {editMode && (
          <div className="mt-4 flex space-x-2">
            <button
              onClick={saveNav}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Save
            </button>
            <button
              onClick={discardChanges}
              className="bg-gray-300 text-black p-2 rounded"
            >
              Discard
            </button>
          </div>
        )}
      </div>
    </DndProvider>
  );
}
