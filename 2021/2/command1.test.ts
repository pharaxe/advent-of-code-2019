import { Command, lineToCommand } from "./commands1";

describe("commands", () => {
  it("can be parsed", () => {
    const line = "forward 1";
    const command: Command = lineToCommand(line);

    expect(command.amount).toBe(1);
    expect(command.direction).toBe("forward");
  });
})