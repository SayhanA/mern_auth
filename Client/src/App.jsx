import { useEffect } from "react";

function App() {
  // localStorage.setItem("theme", "light")
  const selectedTheme = localStorage.getItem("theme");

  useEffect(() => {

    if (selectedTheme) {
      document.body.classList.add(selectedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.add("light");
    }
  }, [selectedTheme]);

  return (
    <div className="bg-background w-screen h-screen flex justify-center pt-20">
      <div className="max-w-sm mx-auto bg-background rounded-2xl shadow-lg overflow-hidden border border-border h-fit">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2 text-text">Card Title</h2>
          <p className="text-text/80 mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
            facere excepturi repellat in rerum sunt ut labore velit reiciendis,
            corporis voluptates molestiae consequatur! Voluptate repellendus
            impedit laudantium veniam aliquam id!
          </p>
          <button className="w-full px-4 py-2 bg-grape/70 text-white rounded-lg hover:bg-grape/100 transition duration-300">
            Click Me
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
