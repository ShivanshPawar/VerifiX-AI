
const ai = require("../config/gemini.config");


(async () => {
  const res = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [
      { role: "user", parts: [{ text: "Say hello in one line" }] }
    ]
  });

  console.log(res.text);
})();
