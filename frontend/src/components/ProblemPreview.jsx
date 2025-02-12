
const ProblemPreview = ( problem ) => {
  const {
    title,
    difficulty,
    tags,
    description,
    inputFormat,
    outputFormat,
    examples
  } = problem;
console.log(title,difficulty,examples)
  return (
    <div className="p-6 ">
      <div className="flex justify-between items-center mb-6">
       
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-7">{title}</h1>
        <div className="flex items-center gap-4 mb-4">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            {difficulty}
          </span>
          <div className="flex gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="prose max-w-none mb-8">
        <h3 className="text-lg font-semibold mb-2">Problem Description</h3>
        <p className="text-gray-700 mb-4">{description}</p>

      

        <h3 className="text-lg font-semibold mb-2">Input Format:</h3>
        <p className="text-gray-700 mb-4">{inputFormat}</p>

        <h3 className="text-lg font-semibold mb-2">Output Format:</h3>
        <p className="text-gray-700 mb-4">{outputFormat}</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Example Test Cases:</h3>
        {examples.map((example, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="font-medium mb-2">Example {index + 1}:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Input:</div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <pre className="text-sm">{JSON.stringify(example.input, null, 2)}</pre>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Output:</div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <pre className="text-sm">{JSON.stringify(example.expectedOutput, null, 2)}</pre>
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Explanation: {example.explanation}
            </div>
          </div>
        ))}
      </div>

     
    </div>
  );
};

export default ProblemPreview;
