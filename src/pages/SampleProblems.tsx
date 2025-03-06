import { useState, useEffect } from "react";
import { Plus, Edit, Trash, Eye, Ellipsis } from "lucide-react";

import { Problem } from "@/lib/types";
import { SAMPLE_PROBLEMS as initialProblems } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STORAGE_KEY = "gas_laws_problems";

const GAS_LAW_NAMES: { [key in Problem["type"]]: string } = {
  boyles: "Boyle's Law",
  charles: "Charles's Law",
  combined: "Combined Gas Law",
  ideal: "Ideal Gas Law",
  "gay-lussac": "Gay-Lussac's Law",
  avogadros: "Avogadro's Law",
};

export default function SampleProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedType, setSelectedType] = useState<string>("boyles");
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingProblem, setViewingProblem] = useState<Problem | null>(null);
  const [newProblem, setNewProblem] = useState<Problem>({
    id: "",
    title: "",
    type: "boyles",
    question: "",
    hint: "",
    solution: "",
  });

  useEffect(() => {
    const storedProblems = localStorage.getItem(STORAGE_KEY);
    if (storedProblems) {
      setProblems(JSON.parse(storedProblems));
    } else {
      setProblems(initialProblems);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProblems));
    }
  }, []);

  useEffect(() => {
    if (selectedType !== "all") {
      setNewProblem((prev) => ({ ...prev, type: selectedType }));
    }
  }, [selectedType]);

  const saveToLocalStorage = (updatedProblems: Problem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProblems));
    setProblems(updatedProblems);
  };

  const addProblem = () => {
    if (!newProblem.title || !newProblem.question) return;
    const problem = {
      ...newProblem,
      id: Date.now().toString(),
    };
    const updatedProblems = [...problems, problem];
    saveToLocalStorage(updatedProblems);
    setNewProblem({
      id: "",
      title: "",
      type: selectedType !== "all" ? selectedType : "boyles",
      question: "",
      hint: "",
      solution: "",
    });
    setIsAddDialogOpen(false);
  };

  const updateProblem = (problem: Problem) => {
    const updatedProblems = problems.map((p) =>
      p.id === problem.id ? problem : p
    );
    saveToLocalStorage(updatedProblems);
    setEditingProblem(null);
  };

  const deleteProblem = (id: string) => {
    const updatedProblems = problems.filter((p) => p.id !== id);
    saveToLocalStorage(updatedProblems);
  };

  const viewProblem = (problem: Problem) => {
    setViewingProblem(problem);
    setIsViewDialogOpen(true);
  };

  const filteredProblems =
    selectedType === "all"
      ? problems
      : problems.filter((p) => p.type === selectedType);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select gas law" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value="all">All Gas Laws</SelectItem> */}
            <SelectItem value="boyles">Boyle's Law</SelectItem>
            <SelectItem value="charles">Charles's Law</SelectItem>
            <SelectItem value="combined">Combined Gas Law</SelectItem>
            <SelectItem value="ideal">Ideal Gas Law</SelectItem>
            <SelectItem value="gay-lussac">Gay-Lussac's Law</SelectItem>
            <SelectItem value="avogadros">Avogadro's Law</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Problem
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Problem</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={newProblem.title}
                onChange={(e) =>
                  setNewProblem({ ...newProblem, title: e.target.value })
                }
              />
              <Textarea
                placeholder="Question"
                value={newProblem.question}
                onChange={(e) =>
                  setNewProblem({ ...newProblem, question: e.target.value })
                }
              />
              <Input
                placeholder="Hint"
                value={newProblem.hint}
                onChange={(e) =>
                  setNewProblem({ ...newProblem, hint: e.target.value })
                }
              />
              <Input
                placeholder="Solution"
                value={newProblem.solution}
                onChange={(e) =>
                  setNewProblem({ ...newProblem, solution: e.target.value })
                }
              />
              <Button onClick={addProblem} className="w-full">
                Add Problem
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Question</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProblems.map((problem) => (
              <TableRow key={problem.id}>
                <TableCell className="font-medium">{problem.title}</TableCell>
                <TableCell>{GAS_LAW_NAMES[problem.type]}</TableCell>
                <TableCell className="max-w-md truncate">
                  {problem.question}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-fit w-fit p-0"
                      >
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => viewProblem(problem)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setEditingProblem(problem)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteProblem(problem.id)}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewingProblem?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Type</h4>
              <p>{viewingProblem && GAS_LAW_NAMES[viewingProblem.type]}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Question</h4>
              <p>{viewingProblem?.question}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Hint</h4>
              <p>{viewingProblem?.hint}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Solution</h4>
              <p>{viewingProblem?.solution}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingProblem}
        onOpenChange={(open) => !open && setEditingProblem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Problem</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={editingProblem?.title}
              onChange={(e) =>
                setEditingProblem((prev) =>
                  prev ? { ...prev, title: e.target.value } : null
                )
              }
            />
            <Textarea
              placeholder="Question"
              value={editingProblem?.question}
              onChange={(e) =>
                setEditingProblem((prev) =>
                  prev ? { ...prev, question: e.target.value } : null
                )
              }
            />
            <Input
              placeholder="Hint"
              value={editingProblem?.hint}
              onChange={(e) =>
                setEditingProblem((prev) =>
                  prev ? { ...prev, hint: e.target.value } : null
                )
              }
            />
            <Input
              placeholder="Solution"
              value={editingProblem?.solution}
              onChange={(e) =>
                setEditingProblem((prev) =>
                  prev ? { ...prev, solution: e.target.value } : null
                )
              }
            />
            <div className="flex gap-2">
              <Button
                onClick={() => editingProblem && updateProblem(editingProblem)}
                className="flex-1"
              >
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditingProblem(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
