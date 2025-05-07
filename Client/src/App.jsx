function App() {
  return (
    <div className="bg-background w-screen h-screen flex justify-center pt-20">
      <div className="max-w-sm mx-auto bg-background rounded-2xl shadow-lg overflow-hidden border border-border h-fit">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Card Title</h2>
        <p className="text-gray-600 mb-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
          facere excepturi repellat in rerum sunt ut labore velit reiciendis,
          corporis voluptates molestiae consequatur! Voluptate repellendus
          impedit laudantium veniam aliquam id!
        </p>
        <button className="w-full px-4 py-2 bg-grape/70 text-[rgb(244,244,244)] rounded-lg hover:bg-blue-500 transition duration-300">
          Click Me
        </button>
      </div>
    </div>
    </div>
  );
}

export default App;
