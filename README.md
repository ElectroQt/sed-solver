# sed-solver

(Attempts to) solve puzzles from https://sed-puzzle.com/.

Prerequisites: Node

## Usage

Download the project.

In the project directory:
```
npm install
```
Then run `index.js`, passing the problem link as a parameter:
```
node index.js https://sed-puzzle.com/problems/xxxx -l=LENGTH
```

## Options

-	`--file`, `-f=PATH`: Provide the problem as a local file instead. The file should be a text file of the following format:

	-	The first line should be the initial string.

	-	Every line that comes after should either be empty or contain a rule. A rule consists of two strings (empty strings are allowed) separated by the right arrow (`->`).

-  `--maxLength`, `-l=LENGTH`: The maximum length that the string being transformed will reach. You should make an educated guess about how long the string will ever get at any point during the transformation. For example, in pure reduction problems like [Tower of JOIOI?](https://sed-puzzle.com/problems/1a0xlWmokZ), the string's max length is simply its initial length. If `LENGTH` is set too low, the solution will not be derived. If `LENGTH` is set too high, there may be a severe performance penalty. It is critical that you set an appropriate value. **This option is mandatory.**

-  `--maxSteps`, `-s=STEPS`: The maximum number of steps that the program will enumerate. It may be necessary to increase `STEPS` for exceedingly complex problems. This option has a minimal effect on performance. Defaults to 100.

-  `--algorithm`, `--alg`, `-a=ALGORITHM`: Which algorithm to use. Currently two algorithms have been implemented — `BFS` (breadth-first search) (default) and `BIDIRECTIONAL` (bidirectional BFS). `BFS` is more efficient when it makes more sense to approach the problem directly (such as in [Tower of JOIOI?](https://sed-puzzle.com/problems/1a0xlWmokZ)). However, `BIDIRECTIONAL` is more feasible when too many expansions can be performed at the beginning and the problem is better dealt with in reverse (such as in [19 Stars](https://sed-puzzle.com/problems/CKEQsyjHSr)). Admittedly, many problems in the problem set can't be solved by either, so please suggest better algorithms if you have any.

## Examples

```
node.exe index.js https://sed-puzzle.com/problems/FT3vMuE-KX -l 12 -s 150 -a BFS > solution.txt
```

Or, solve a local problem:

```
node.exe index.js -f problem.txt -l 20 -a BIDIRECTIONAL > solution.txt
```