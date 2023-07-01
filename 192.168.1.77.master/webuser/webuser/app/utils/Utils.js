import React from "react";
import namor from "namor";
// import "./index.css";

const range = len => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  const statusChance = Math.random();
  return {
    firstName: namor.generate({ words: 1, numbers: 0 }),
    lastName: namor.generate({ words: 1, numbers: 0 }),
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status:
      statusChance > 0.66
        ? "relationship"
        : statusChance > 0.33 ? "complicated" : "single"
  };
};

export function makeData(len = 5553) {
  return range(len).map(d => {
    return {
      ...newPerson(),
      children: range(10).map(newPerson)
    };
  });
}

export const Logo = () =>
  <div style={{ margin: '1rem auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
    For more examples, visit {''}
    <br />
    <a href="https://github.com/react-tools/react-table" target="_blank">
      <img
        src="https://github.com/react-tools/media/raw/master/logo-react-table.png"
        style={{ width: `150px`, margin: ".5em auto .3em" }}
      />
    </a>
  </div>;

export const Tips = () =>
  <div style={{ textAlign: "center" }}>
    <em>Tip: Hold shift when sorting to multi-sort!</em>
  </div>;

export const getRandomColor = (index) => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  //orange, red, gray, green, blue
  let defaultColor = [
    "rgba(223, 122, 0, 1)", "rgba(223, 174, 0, 1)", "rgba(178, 223, 0, 1)", "rgba(111, 223, 0, 1)",
    "rgb(255, 133, 27)", "rgb(220, 41, 55)", "rgb(110, 125, 139)", "rgb(88, 134, 135)", "rgb(0, 116, 217)",
    "rgb(215, 113, 57)", "rgb(180, 61, 75)", "rgb(150, 175, 159)", "rgb(48, 114, 115)", "rgb(40, 136, 197)",
    "rgb(175, 93, 77)", "rgb(140, 81, 95)", "rgb(190, 195, 179)", "rgb(8, 94, 95)", "rgb(80, 156, 217)",
    "rgb(135, 73, 97)", "rgb(100, 101, 115)", "rgb(230, 215, 199)", "rgb(128, 74, 75)", "rgb(120, 176, 177)",
    "rgb(95, 53, 117)", "rgb(60, 121, 135)", "rgb(250, 235, 219)", "rgb(168, 54, 55)", "rgb(160, 196, 157)",
    "rgb(55, 33, 137)", "rgb(20, 131, 155)", "rgb(70, 255, 239)", "rgb(208, 34, 35)", "rgb(200, 216, 137)",
  ]

  return defaultColor[index] ? defaultColor[index] : color;
}
