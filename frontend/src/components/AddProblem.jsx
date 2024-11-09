import  { useState } from "react";
import ReactQuill from "react-quill";
import { BACKEND_URL } from "../../utils";
import axios from "axios";
import "react-quill/dist/quill.snow.css";

export default function AddProblem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tags, setTags] = useState([]);
  const [testcases, setTestcases] = useState([
    { input: "", expectedOutput: "" },
  ]);

  const predefinedTags = ["string", "math", "queue", "stack", "graph", "dp"];

  const titleHandler = (e) => setTitle(e.target.value);
  const descriptionHandler = (content) => setDescription(content);
  const difficultyHandler = (value) => setDifficulty(value);

  const handleTestcaseChange = (index, field, value) => {
    const updatedTestcases = [...testcases];
    updatedTestcases[index][field] = value;
    setTestcases(updatedTestcases);
  };

  const addTestcase = () => {
    setTestcases([...testcases, { input: "", expectedOutput: "" }]);
  };

  const removeTestcase = (index) => {
    const updatedTestcases = testcases.filter((_, i) => i !== index);
    setTestcases(updatedTestcases);
  };

  const submitHandler = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/user/addproblem`, {
        title,
        description,
        difficulty,
        testCases: testcases,
        tags,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto bg-white rounded shadow-lg space-y-6">
      <button
        onClick={submitHandler}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        ADD PROBLEM
      </button>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block font-semibold mb-2">
              Title
            </label>
            <input
              id="title"
              value={title}
              onChange={titleHandler}
              placeholder="Enter the title"
              type="text"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Difficulty</label>
            <div className="flex space-x-4">
              {["easy", "medium", "hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => difficultyHandler(level)}
                  className={`${
                    difficulty === level
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  } py-2 px-4 rounded`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {predefinedTags.map((tag) => (
                <label key={tag} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={tag}
                    onChange={(e) => {
                      const selectedTag = e.target.value;
                      setTags((prevTags) =>
                        prevTags.includes(selectedTag)
                          ? prevTags.filter((t) => t !== selectedTag)
                          : [...prevTags, selectedTag]
                      );
                    }}
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="description" className="block font-semibold mb-2">
              Description
            </label>
            <ReactQuill
              value={description}
              onChange={descriptionHandler}
              placeholder="Enter the description"
              className="h-40 mb-6"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Test Cases</label>
            {testcases.map((testcase, index) => (
              <div key={index} className="mb-4 border p-4 rounded space-y-2">
                <div>
                  <label className="block font-semibold">Input</label>
                  <input
                    type="text"
                    value={testcase.input}
                    onChange={(e) =>
                      handleTestcaseChange(index, "input", e.target.value)
                    }
                    placeholder="Enter space-separated input"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Expected Output</label>
                  <input
                    type="text"
                    value={testcase.expectedOutput}
                    onChange={(e) =>
                      handleTestcaseChange(
                        index,
                        "expectedOutput",
                        e.target.value
                      )
                    }
                    placeholder="Enter expected output"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeTestcase(index)}
                  className="text-red-500"
                >
                  Remove Test Case
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTestcase}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Add Test Case
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
