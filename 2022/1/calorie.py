# aoc_template.py

import pathlib
import sys
import functools


def transformChunkToElf(chunk):
    caloriesString = chunk.split("\n")
    calories = list(map(int, caloriesString))
    total = sum(calories)

    return {
        'total': total,
        'calories': calories
    }


def getChonkiestElf(elves):
    def reduceToMaxCalories(curr, accum):
        if accum is None or curr['total'] > accum['total']:
            return curr
        else:
            return accum

    chonkElf = functools.reduce(reduceToMaxCalories, elves)
    return chonkElf


def parse(puzzle_input):
    """Parse input."""
    chunks = puzzle_input.split("\n\n")
    elves = list(map(transformChunkToElf, chunks))
    return elves


def part1(data):
    """Solve part 1."""
    maxElf = getChonkiestElf(data)
    return maxElf['total']


def compareElvesByTotalCalories(a, b):
    return a['total'] - b['total']


def part2(data):
    """Solve part 2."""
    totals = map(lambda x: x['total'], data)
    sortedTotals = sorted(totals, reverse=True)
    return sortedTotals[0] + sortedTotals[1] + sortedTotals[2]


def solve(puzzle_input):
    """Solve the puzzle for the given input."""
    data = parse(puzzle_input)
    solution1 = part1(data)
    solution2 = part2(data)

    return solution1, solution2


if __name__ == "__main__":
    for path in sys.argv[1:]:
        print(f"{path}:")
        puzzle_input = pathlib.Path(path).read_text().strip()
        solutions = solve(puzzle_input)
        print("\n".join(str(solution) for solution in solutions))
