# sed-solver

(Attempts to) solve puzzles from https://sed-puzzle.com/.

Prerequisites: Node

## Usage

In the project directory:
```
npm install
```
Then run `index.js` with the problem link as a parameter:
```
node index.js https://sed-puzzle.com/problems/xxxx
```

## Options

-  `--maxLength`, `-l`: The maximum length that the string being transformed will reach. You should make an educated guess about how long the string will ever get at any point during the transformation. For example, in pure reduction problems like [Tower of JOIOI?](https://sed-puzzle.com/problems/1a0xlWmokZ), the string's max length is simply its initial length. If this option is set too low, the solution will not be derived. If this option is set too high, there may be a severe performance penalty. It is critical that you set an appropriate value. **This option is mandatory.**

-  `--maxSteps`, `-s`: The maximum number of steps that the program will enumerate. It may be necessary to increase this for exceedingly complex problems. This option has a minimal effect on performance. Defaults to 100.

-  `--algorithm`, `--alg`, `-a`: Which algorithm to use. Currently two algorithms have been implemented — `BFS` (breadth-first search) (default) and `BIDIRECTIONAL` (bidirectional BFS). `BFS` is more efficient when it makes more sense to approach the problem directly (such as in [Tower of JOIOI?](https://sed-puzzle.com/problems/1a0xlWmokZ)). However, `BIDIRECTIONAL` is more feasible when too many expansions can be performed at the beginning and the problem is better dealt with in reverse (such as in [19 Stars](https://sed-puzzle.com/problems/CKEQsyjHSr)). Admittedly, many problems in the problem set can't be solved by either, so please suggest better algorithms if you have any.

## Examples

```
node.exe index.js https://sed-puzzle.com/problems/FT3vMuE-KX -l 12 -s 150 -a BFS > solution.txt
```
