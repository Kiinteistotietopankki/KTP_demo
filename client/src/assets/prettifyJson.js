export function prettifyJson(input) {
  let jsonObj;

  if (typeof input === "string") {
    try {
      jsonObj = JSON.parse(input);
    } catch (error) {
      console.error("Invalid JSON string provided:", error.message);
      return null;
    }
  } else if (typeof input === "object" && input !== null) {
    jsonObj = input;
  } else {
    console.error("Input must be a JSON string or an object");
    return null;
  }

  // Return pretty printed JSON string
  return JSON.stringify(jsonObj, null, 2);
}
