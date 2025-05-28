
import { useState } from "react";
import { BACKEND_URL } from "../../utils";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import TestCases from "./TestCases";
import ProblemPreview from "./ProblemPreview";

export default function AddProblem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inputFormat, setInputFormat] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [tags, setTags] = useState([]);
  const [testCases, setTestCases] = useState([]);

  const predefinedTags = ["STRING", "MATH", "QUEUE", "STACK", "GRAPH", "DYNAMIC PROGRAMMING"];

  const addTestCase = (newTestCase) => {
    setTestCases([...testCases, newTestCase]);
  };
  
  const updateTestCases = (updatedTestCases) => {
    setTestCases(updatedTestCases);
  };

  const titleHandler = (e) => setTitle(e.target.value);
  const descriptionHandler = (content) => setDescription(content);
  const difficultyHandler = (value) => setDifficulty(value);
  const inputFormatHandler = (value) => setInputFormat(value);
  const outputFormatHandler = (value) => setOutputFormat(value);
  // const submitHandler = async () => {
  //        try {
  //          const res = await axios.post(`${BACKEND_URL}/user/addproblem`, {
  //           title,
  //            description,
  //            difficulty,
  //          testCases: testCases,
  //            tags,
  //            inputFormat,
  //            outputFormat
  //          });
  //          console.log(res.data);
  //        } catch (error) {
  //          console.log(error);
  //        }
  //      };
  const submitHandler = async () => {
  try {
    const token = localStorage.getItem("authorization"); 
    const res = await axios.post(
      `${BACKEND_URL}/user/addproblem`,
      {
        title,
        description,
        difficulty,
        testCases,
        tags,
        inputFormat,
        outputFormat
      },
      {
        headers: {
          Authorization: `${token}`
        }
      }
    );
    console.log(res.data);
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
};


  return (
    <div className="p-6" id="el-986vn1ao">
      <h2 className="text-2xl font-semibold mb-6" id="el-fd4jujes">
        Create Problem
      </h2>
      <form id="el-iqmnno0d " className="bg-gray-200 p-4" >
        <div className="space-y-6" id="el-67o4p58e">
          <div id="el-fsezfu00">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
              id="el-wzwojhof"
            >
              Problem Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={titleHandler}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter problem title"
            />
          </div>

          <div id="el-mubeujex">
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium text-gray-700 mb-1"
              id="el-5eyrh0zl"
            >
              Difficulty Level
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={difficulty}
              onChange={(e) => difficultyHandler(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="easy" id="el-j96pgji4">
                Easy
              </option>
              <option value="medium" id="el-f31exha5">
                Medium
              </option>
              <option value="hard" id="el-mil94658">
                Hard
              </option>
            </select>
          </div>

          <div id="el-dajfm1l6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
              id="el-y7n7c9fq"
            >
              Problem Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="6"
              value={description}
              onChange={(e) => descriptionHandler(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter detailed problem description"
            />
          </div>

        

          <div id="el-y29niamv">
            <label
              htmlFor="inputFormat"
              className="block text-sm font-medium text-gray-700 mb-1"
              id="el-03uu3wzy"
            >
              Input Format
            </label>
            <textarea
              id="inputFormat"
              name="inputFormat"
              rows="3"
              onChange={(e) => inputFormatHandler(e.target.value)}
              value={inputFormat}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe input format"
            />
          </div>

          <div id="el-wtcm198z">
            <label
              htmlFor="outputFormat"
              className="block text-sm font-medium text-gray-700 mb-1"
              id="el-s2klf1k1"
            >
              Output Format
            </label>
            <textarea
              id="outputFormat"
              name="outputFormat"
              rows="3"
              onChange={(e) => outputFormatHandler(e.target.value)}
              value={outputFormat}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe output format"
            />
          </div>

          <div id="el-ae7n9zno">
            <label className="block text-sm font-medium text-gray-700 mb-1" id="el-sisgxy3l">
              Tags
            </label>
            <div className="flex flex-wrap gap-2" id="el-pj3ybxu8">
              {predefinedTags.map((tag) => (
                <div key={tag} className="flex items-center gap-2">
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
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label>{tag}</label>
                </div>
              ))}
            </div>
          </div>

         
        </div>
      </form>
      <div className="mt-10 mb-10 bg-gray-100">
      <TestCases addTestCase={addTestCase} updateTestCases={updateTestCases} testCases={testCases}/>
      </div>
      <div className="bg-gray-50 mb-4">
      <h2 className="text-2xl font-semibold">Problem Preview</h2>
      <ProblemPreview title={title} difficulty={difficulty} tags={tags} description={description} inputFormat={inputFormat} outputFormat={outputFormat}   examples={testCases.slice(0, 2)}
      />

      </div>
      <div className="flex justify-end space-x-4" id="el-q1fvl2r1">
            <button
              onClick={submitHandler}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              id="el-1bd0kakj"
            >
              Continue
            </button>
          </div>
    </div>
  );
}

