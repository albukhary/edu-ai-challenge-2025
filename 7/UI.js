import readline from "readline";
import { stdin as input, stdout as output } from "process";

export default class UI {
  constructor() {
    this.rl = readline.createInterface({ input, output });
  }

  async prompt(message) {
    return new Promise((resolve) => {
      this.rl.question(message, (answer) => resolve(answer));
    });
  }

  print(message) {
    console.log(message);
  }

  close() {
    this.rl.close();
  }
}
