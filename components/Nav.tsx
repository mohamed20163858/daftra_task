// components/Nav.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SettingIcon from "../public/settings.svg";
import DominoIcon from "../public/domino.svg";
import EditIcon from "../public/edit.svg";
import EyeIcon from "../public/eye.svg";
import EyeOffIcon from "../public/eyeOff.svg";
import { FaArrowLeft } from "react-icons/fa";

import { FiChevronDown, FiChevronUp, FiCheck } from "react-icons/fi";

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
// Added a new "level" prop to determine background.
interface NavItemComponentProps {
  item: NavItem;
  index: number;
  level: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  editMode: boolean;
  updateTitle: (id: number | string, newTitle: string) => void;
  updateVisibility: (id: number | string, newVisible: boolean) => void;
}

const NavItemComponent = ({
  item,
  index,
  moveItem,
  editMode,
  updateTitle,
  updateVisibility,
}: NavItemComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(item.title);
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "NAV_ITEM",
    item: { id: item.id, index },
    canDrag: () => editMode, // enable dragging only in edit mode
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "NAV_ITEM",
    hover(dragged: DragItem, monitor) {
      if (!editMode) return; // only allow hover actions in edit mode
      if (!ref.current) return;
      const dragIndex = dragged.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveItem(dragIndex, hoverIndex);
      dragged.index = hoverIndex;
    },
  });

  if (editMode) {
    drag(drop(ref));
  }

  // Set background color based on level:
  // Top-level (level === 0) gets bg-[#F7F7F7], children get white.
  //   const bgClass = level === 0 ? "bg-[#F7F7F7]" : "bg-white";

  const href = item.title === "Dashboard" ? "/" : "/empty";

  const handleSave = () => {
    updateTitle(item.id, draftTitle);
    setIsEditing(false);
  };

  return (
    <div
      ref={ref}
      className={`p-2 rounded mb-2 w-full ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {editMode ? (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div>
              <DominoIcon className="w-[30px] h-[30px] text-[#404040]" />
            </div>
            {isEditing ? (
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                }}
                className="border p-1 w-[90%]"
              />
            ) : (
              <span>{item.title}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <button onClick={handleSave} aria-label="Save Title">
                <FiCheck size={25} />
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setDraftTitle(item.title);
                }}
                aria-label="Edit Title"
              >
                <div className="flex items-center justify-center">
                  <EditIcon className="w-[25px] h-[25px] text-[#848484]" />
                </div>
              </button>
            )}
            <button
              onClick={() =>
                updateVisibility(item.id, !(item.visible !== false))
              }
              aria-label="Toggle Visibility"
            >
              {item.visible !== false ? (
                <div className="flex items-center justify-center mb-[-10px]">
                  <EyeIcon className="w-[25px] h-[25px] text-[#848484]" />
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <EyeOffIcon className="w-[25px] h-[25px] text-[#848484]" />
                </div>
              )}
            </button>
          </div>
        </div>
      ) : item.children && item.children.length > 0 ? (
        <span>{item.title}</span>
      ) : (
        <Link href={href}>
          <span>{item.title}</span>
        </Link>
      )}
    </div>
  );
};

// --- NavItemWrapper ---
interface NavItemWrapperProps {
  item: NavItem;
  index: number;
  level: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  editMode: boolean;
  updateTitle: (id: number | string, newTitle: string) => void;
  updateVisibility: (id: number | string, newVisible: boolean) => void;
  onChange: (newItem: NavItem, index: number) => void;
  apiUrl: string;
}

const NavItemWrapper = ({
  item,
  index,
  level,
  moveItem,
  editMode,
  updateTitle,
  updateVisibility,
  onChange,
  apiUrl,
}: NavItemWrapperProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div>
      <div
        className={`flex items-center justify-between px-4 py-2 rounded-[4px] ${
          level === 0 ? "bg-[#F7F7F7]" : "bg-white"
        }`}
      >
        <NavItemComponent
          item={item}
          index={index}
          level={level}
          moveItem={moveItem}
          editMode={editMode}
          updateTitle={updateTitle}
          updateVisibility={updateVisibility}
        />
        {item.children && item.children.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <FiChevronUp size={25} className="text-[#848484]" />
            ) : (
              <FiChevronDown size={25} className="text-[#848484]" />
            )}
          </button>
        )}
      </div>
      {expanded && item.children && item.children.length > 0 && (
        <div className="pl-4">
          <NavList
            items={item.children}
            level={level + 1}
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

const NavList = ({
  items,
  level,
  onChange,
  editMode,
  apiUrl,
}: NavListProps) => {
  const displayedItems = !editMode
    ? items.filter((item) => item.visible !== false)
    : items;

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

  const updateVisibilityLocal = (id: number | string, newVisible: boolean) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, visible: newVisible } : item
    );
    onChange(newItems);
  };

  return (
    <div className="px-4">
      {displayedItems.map((item, index) => (
        <div key={item.id} className="mb-2">
          <NavItemWrapper
            item={item}
            index={index}
            level={level}
            moveItem={moveItem}
            editMode={editMode}
            updateTitle={updateTitleLocal}
            updateVisibility={updateVisibilityLocal}
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
interface NavProps {
  setOpen?: (open: boolean) => void;
}

export default function Nav({ setOpen }: NavProps) {
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
      <div className="text-[#404040] text-[25px] font-medium leading-[26.22px] tracking-[0]">
        <div className="flex justify-between items-center mb-4 border-b border-[#E9E9E9] pb-4">
          <h2 className="text-[25px] font-medium leading-[26.22px] tracking-[0] ml-4 flex items-center">
            <div className="flex justify-end p-2 md:hidden">
              <button
                onClick={() => {
                  if (setOpen) setOpen(false);
                }}
                aria-label="Close Menu"
              >
                <FaArrowLeft size={24} />
              </button>
            </div>
            <span>Menu</span>
          </h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className="cursor-pointer mr-4"
          >
            <div>
              <SettingIcon className="w-[30px] h-[30px] " />
            </div>
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
