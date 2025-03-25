// components/Nav.tsx
"use client";

import { useState, useEffect } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FiSettings } from "react-icons/fi";

interface NavItem {
  id: string;
  title: string;
  url: string;
  visible: boolean;
  order: number;
}

interface DragItem {
  id: string;
  index: number;
}

interface NavItemProps {
  item: NavItem;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  editMode: boolean;
  updateTitle: (id: string, newTitle: string) => void;
}

const NavItemComponent = ({
  item,
  index,
  moveItem,
  editMode,
  updateTitle,
}: NavItemProps) => {
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

  return (
    <div
      ref={(node) => {
        drag(drop(node));
      }}
      className={`p-2 border rounded mb-2 bg-white ${
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
      ) : (
        <span>{item.title}</span>
      )}
    </div>
  );
};

export default function Nav() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);

  // Use environment variable for API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

  // Fetch nav items on mount
  useEffect(() => {
    fetch(`${API_URL}/nav`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.text();
      })
      .then((text) => {
        const data: NavItem[] = text ? JSON.parse(text) : [];
        // Assuming the API returns an unsorted array; sort by order property
        setNavItems(data.sort((a, b) => a.order - b.order));
      })
      .catch((error) => {
        console.error("Error fetching navigation:", error);
      });
  }, [API_URL]);

  // Function to reorder items and track changes
  const moveItem = (fromIndex: number, toIndex: number) => {
    const updatedItems = [...navItems];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setNavItems(updatedItems);

    // Immediately track drag-and-drop event
    fetch(`${API_URL}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: movedItem.id, from: fromIndex, to: toIndex }),
    });
  };

  // Update the title of a nav item
  const updateTitle = (id: string, newTitle: string) => {
    setNavItems(
      navItems.map((item) =>
        item.id === id ? { ...item, title: newTitle } : item
      )
    );
  };

  // Save the navigation changes
  const saveNav = () => {
    // Update order properties based on current array order
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
      .then((text) => {
        // Optionally, parse JSON if text exists
        if (text) {
          try {
            JSON.parse(text);
          } catch {
            console.error("Response was not valid JSON:", text);
          }
        }
        setEditMode(false);
      })
      .catch((error) => {
        console.error("Error saving navigation:", error);
      });
  };

  // Discard changes by reloading nav from API
  const discardChanges = () => {
    fetch(`${API_URL}/nav`)
      .then((res) => res.json())
      .then((data: NavItem[]) => {
        setNavItems(data.sort((a, b) => a.order - b.order));
        setEditMode(false);
      });
  };

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
        <div>
          {navItems.map((item, index) => (
            <NavItemComponent
              key={item.id}
              item={item}
              index={index}
              moveItem={moveItem}
              editMode={editMode}
              updateTitle={updateTitle}
            />
          ))}
        </div>
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
