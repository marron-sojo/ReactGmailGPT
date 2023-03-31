// function App() {
//   return (
//     <div>
//       <h1>React Chrome Extension</h1>
//     </div>
//   );
// }

// export default App;

function App() {
  const appStyles = {
    position: "fixed",
    top: "10px",
    right: "10px",
    zIndex: 1000,
    backgroundColor: "white",
    padding: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "4px",
  };

  return (
    <div style={appStyles}>
      <h1>React Chrome Extension</h1>
    </div>
  );
}

export default App;