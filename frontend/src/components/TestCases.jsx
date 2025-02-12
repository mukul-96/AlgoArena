import  { useState } from 'react';

const TestCases = ({addTestCase,updateTestCases, testCases}) => {
  const [input, setInput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');

  const handleSubmit = () => {
    const newTestCase = { input, expectedOutput };
    addTestCase(newTestCase);
    setInput('');
    setExpectedOutput('');
  };

  const editTestCase = (index) => {
    const testCase = testCases[index];
    setInput(testCase.input);
    setExpectedOutput(testCase.expectedOutput);

    const updatedTestCases = testCases.filter((_, i) => i !== index);
    updateTestCases(updatedTestCases);
  };
  const deleteTestCase = (index) => {
    const updatedTestCases = testCases.filter((_, i) => i !== index);
    updateTestCases(updatedTestCases);
  };
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Test Cases</h2>

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-1">Input</label>
            <textarea
              id="input"
              name="input"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter test case input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="expectedOutput" className="block text-sm font-medium text-gray-700 mb-1">Expected Output</label>
            <textarea
              id="expectedOutput"
              name="expectedOutput"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter expected output"
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleSubmit}
          >
            Add Test Case
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Added Test Cases</h3>

        {testCases.map((testCase, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Test Case #{index + 1}</h4>
              <div className="flex space-x-2">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => editTestCase(index)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => deleteTestCase(index)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Input:</div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <pre className="text-sm">{testCase.input}</pre>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Expected Output:</div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <pre className="text-sm">{testCase.expectedOutput}</pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back
        </button>
       
      </div>
    </div>
  );
};

export default TestCases;
