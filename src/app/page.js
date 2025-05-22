"use client";

import React, { useEffect, useState } from "react";
import {
  Checkbox,
  IconButton,
  TextField,
  Button,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/todolist-all")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setTodos(data);
      });
  }, []);

  const addTodo = () => {
    if (input.trim() !== "") {
      fetch("http://localhost:4000/add-todolist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: input }),
      })
        .then((res) => res.json())
        .then((data) => {
          setTodos([
            ...todos,
            { id: data.id, text: data.task, completed: false },
          ]);
          setInput("");
        });
    }
  };

  const toggleComplete = (id) => {
    fetch(`http://localhost:4000/toggle-completed/${id}`, {
      method: "PATCH",
    }).then(() => {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    });
  };

  const confirmDelete = () => {
    fetch(`http://localhost:4000/delete-todolist/${deleteId}`, {
      method: "DELETE",
    }).then(() => {
      setTodos(todos.filter((todo) => todo.id !== deleteId));
      handleCloseDialog();
    });
  };

  const handleOpenDialog = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setDeleteId(null);
    setOpenDialog(false);
  };

  const startEdit = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const saveEdit = (id) => {
    fetch(`http://localhost:4000/edit-todolist/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: editText }),
    }).then(() => {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: editText } : todo
        )
      );
      setEditingId(null);
      setEditText("");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        <h1
          className="text-4xl font-bold mb-6 text-center tracking-tight"
          style={{ color: "#7965C1" }}
        >
          📝 รายการสิ่งที่ต้องทำ
        </h1>

        <div className="flex items-center gap-3 mb-6">
          <TextField
            fullWidth
            label="เพิ่มรายการใหม่"
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            InputProps={{
              style: { borderRadius: 20 },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#7965C1", // เปลี่ยนสีกรอบ
                },
                "&:hover fieldset": {
                  borderColor: "#6753AF", // สีกรอบตอน hover (เข้มขึ้น)
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#5E3B8B", // สีกรอบเมื่อฟิลด์ได้รับการโฟกัส
                },
                "&.Mui-focused input": {
                  color: "#7965C1", // เปลี่ยนสีข้อความเมื่อฟิลด์ได้รับการโฟกัส
                },
              },
              "& .MuiInputLabel-root": {
                color: "#7965C1", // เปลี่ยนสีของ label
              },
              "& .Mui-focused .MuiInputLabel-root": {
                color: "#5E3B8B", // เปลี่ยนสีของ label เมื่อฟิลด์ได้รับการโฟกัส
              },
            }}
          />
          <Button
            variant="contained"
            className="shadow-md"
            sx={{
              backgroundColor: "#7965C1",
              "&:hover": {
                backgroundColor: "#6753AF",
              },
              borderRadius: 20,
              fontSize: "1rem",
              minWidth: "100px",
              height: "40px",
            }}
            onClick={addTodo}
          >
            เพิ่ม
          </Button>
        </div>

        <div className="space-y-4">
          {todos.map((todo) => (
            <Paper
              key={todo.id}
              elevation={3}
              className="flex items-center justify-between px-3 py-3 rounded-lg transition-all hover:shadow-lg"
              sx={{ borderRadius: 20 }}
            >
              <div className="flex items-center gap-3 w-full">
                <Checkbox
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  sx={{
                    color: todo.completed ? "green" : "default", // สีเขียวเมื่อ checked
                    "&.Mui-checked": {
                      color: "#328E6E", // เปลี่ยนสีของ Checkbox เมื่อเลือกแล้ว
                    },
                  }}
                />

                {editingId === todo.id ? (
                  <TextField
                    className="flex-grow"
                    size="small"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(todo.id)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#7965C1", // เปลี่ยนสีกรอบ
                        },
                        "&:hover fieldset": {
                          borderColor: "#6753AF", // สีกรอบตอน hover (เข้มขึ้น)
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#5E3B8B", // สีกรอบเมื่อฟิลด์ได้รับการโฟกัส
                        },
                        "&.Mui-focused input": {
                          color: "#7965C1", // เปลี่ยนสีข้อความเมื่อฟิลด์ได้รับการโฟกัส
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#7965C1", // เปลี่ยนสีของ label
                      },
                      "& .Mui-focused .MuiInputLabel-root": {
                        color: "#5E3B8B", // เปลี่ยนสีของ label เมื่อฟิลด์ได้รับการโฟกัส
                      },
                    }}
                  />
                ) : (
                  <span
                    className={`flex-grow text-lg ${
                      todo.completed
                        ? "line-through text-gray-500"
                        : "text-purple-900"
                    }`}
                  >
                    {todo.task}
                  </span>
                )}
              </div>

              <div className="flex gap-1">
                {editingId === todo.id ? (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => saveEdit(todo.id)}
                    sx={{
                      backgroundColor: "#328E6E", // สีพื้นหลังหลักของปุ่ม
                      color: "#ffffff", // สีของตัวหนังสือ
                      "&:hover": {
                        backgroundColor: "#2A7359", // สีพื้นหลังเมื่อ hover (เข้มขึ้นเล็กน้อย)
                      },
                      borderRadius: 20,
                      fontSize: "0.8rem",
                      minWidth: "60px",
                      height: "30px",
                      ml: 2,
                    }}
                  >
                    บันทึก
                  </Button>
                ) : (
                  <Tooltip title="แก้ไข">
                    <IconButton
                      sx={{ color: "#5E3B8B" }}
                      onClick={() => startEdit(todo.id, todo.task)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="ลบ">
                  <IconButton
                    color="error"
                    onClick={() => handleOpenDialog(todo.id)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </div>
            </Paper>
          ))}
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle className="text-purple-900">ยืนยันการลบ</DialogTitle>
        <DialogContent className="text-purple-900">
          คุณต้องการลบรายการนี้หรือไม่?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            ยกเลิก
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            sx={{ borderRadius: 20 }}
          >
            ลบ
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
