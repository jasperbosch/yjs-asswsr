import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CountdownComponent} from 'ngx-countdown';
import {interval} from 'rxjs';
import {AsswsrService} from '../../services/asswsr.service';
import {Cell, keyboardMap, Maze} from './models';

@Component({
  selector: 'app-opdracht8',
  templateUrl: './opdracht8.component.html',
  styleUrls: ['./opdracht8.component.scss']
})
export class Opdracht8Component implements OnInit, OnDestroy, AfterViewInit {


  @ViewChild('maze') myMaze: ElementRef;
  @ViewChild('hole') myHole: ElementRef;
  @ViewChild('arrows') myArrows: ElementRef;

  mazeScope;
  holeScope;

  row = 16;
  col = 16;
  private maze: Maze;
  private readonly cellSize = 20; // length of cell edge
  private readonly cellEdgeThickness = 2; // thickness of cell edge
  private readonly cellBackground = '#FFFFFF';
  private readonly cellVisitedBackground = 'silver';
  private readonly solutionPathColor = '#FF7575';
  private readonly myPathColor = '#4080FF';
  private readonly myBorderColor = '#000000';
  private readonly myPathThickness = 10;
  private readonly solutionPathThickness = 3;
  private gameOver = false;
  private myPath: Cell[] = [];
  private currentCell: Cell;
  showTestButton = false;
  busy = false;

  hole;
  coverSwitch = true;

  steps = 0;
  peaks = 0;

  countdown = 5 * 60;
  progress;
  subs;

  allesOK = false;
  cheated = false;

  @ViewChild('cd', {static: false}) private countdownC: CountdownComponent;

  constructor(private readonly asswsr: AsswsrService, private readonly router: Router) {
    this.asswsr.studentStartOpdracht(8);
  }

  ngOnInit(): void {
    this.subs = interval(100).subscribe(result => {
      this.progress = (((this.countdown - (result / 10)) / this.countdown) * 100);
    });
  }

  ngAfterViewInit(): void {
    this.mazeScope = new paper.PaperScope();
    this.mazeScope.setup(this.myMaze.nativeElement);
    this.mazeScope.view.autoUpdate = true;

    this.holeScope = new paper.PaperScope();
    this.holeScope.setup(this.myHole.nativeElement);

    this.drawMaze();
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  handleEvent(event): void {
    if (event.action === 'done') {
      this.sendAnswer();
      this.router.navigate(['deelnemer', 'corridor']);
    }
  }

  klaar(): void {
    this.sendAnswer();
    // redirect
    this.router.navigate(['deelnemer', 'opdracht9']);
  }

  private sendAnswer(): void {
    // send time to server
    const answer = {steps: this.steps, cheated: this.cheated, peaks: this.peaks, done: this.allesOK};
    const tijd = this.countdown - (this.countdownC.left / 1000);
    this.asswsr.sendAnswer(8, tijd, answer);
  }

  drawMaze(): void {
    this.mazeScope.activate();
    this.busy = true;
    this.validateInputs();

    this.maze = new Maze(this.row, this.col);

    const width = this.col * this.cellSize;
    const height = this.row * this.cellSize;
    const halfWidth = width / 2;

    this.myMaze.nativeElement.width = width;
    this.myMaze.nativeElement.style.width = width + 'px';
    this.myMaze.nativeElement.height = height;
    this.myMaze.nativeElement.style.height = height + 'px';
    this.myMaze.nativeElement.style.left = `Calc(50% - ${halfWidth}px)`;

    this.myArrows.nativeElement.style.top = (135 + this.row * this.cellSize) + 'px';

    // open the first and last cells to show the entrance and exit
    this.maze.firstCell.westEdge = false;
    this.maze.lastCell.eastEdge = false;

    // draw the cells
    this.maze.cells.forEach(x => x.forEach(c => this.draw(c)));

    this.initPlay();

    this.holeScope.activate();
    this.myHole.nativeElement.width = width;
    this.myHole.nativeElement.style.width = width + 'px';
    this.myHole.nativeElement.height = height;
    this.myHole.nativeElement.style.height = height + 'px';
    this.myHole.nativeElement.style.left = `Calc(50% - ${halfWidth}px)`;

    const c1 = new this.holeScope.Path.Rectangle(new this.holeScope.Rectangle(0, 0, this.col * this.cellSize, this.row * this.cellSize));
    c1.fillColor = new this.holeScope.Color('#000000');
    this.hole = new this.holeScope.Path.Circle(new this.holeScope.Point(this.cellSize / 2, this.cellSize / 2), this.cellSize * 3);
    this.hole.fillColor = new this.holeScope.Color('#000000');
    this.hole.blendMode = 'xor';

    this.mazeScope.activate();

    this.busy = false;
  }

  initPlay(): void {
    this.gameOver = false;
    this.coverSwitch = true;
    this.steps = 0;
    this.peaks = 0;
    this.allesOK = false;

    this.myPath.length = 0;
    this.currentCell = this.maze.firstCell; // reset myPath position
    this.myPath.push(this.currentCell);

    // draw the initial step of myPath in the first Cell as entrance
    const initial = new this.mazeScope.Path(new this.mazeScope.Point(0, this.cellSize / 2));
    initial.strokeWidth = this.myPathThickness;
    initial.strokeColor = new this.mazeScope.Color(this.myPathColor);
    initial.add(new this.mazeScope.Point(this.cellSize / 2, this.cellSize / 2));
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.gameOver) {
      return;
    }
    const direction = keyboardMap[event.key];
    if (direction) {
      this.move(direction);
      event.preventDefault();
    }
  }

  move(direction: 'Left' | 'Right' | 'Up' | 'Down'): void {
    let nextCell: Cell;
    if (direction === 'Left') {
      if (this.currentCell.col < 1) {
        return;
      }
      nextCell = this.maze.cells[this.currentCell.row][
      this.currentCell.col - 1
        ];
    }
    if (direction === 'Right') {
      if (this.currentCell.col + 1 >= this.col) {
        return;
      }
      nextCell = this.maze.cells[this.currentCell.row][
      this.currentCell.col + 1
        ];
    }
    if (direction === 'Up') {
      if (this.currentCell.row < 1) {
        return;
      }
      nextCell = this.maze.cells[this.currentCell.row - 1][
        this.currentCell.col
        ];
    }
    if (direction === 'Down') {
      if (this.currentCell.row + 1 >= this.row) {
        return;
      }
      nextCell = this.maze.cells[this.currentCell.row + 1][
        this.currentCell.col
        ];
    }

    this.steps++;

    if (this.currentCell.isConnectedTo(nextCell)) {
      if (
        this.myPath.length > 1 &&
        this.myPath[this.myPath.length - 2].equals(nextCell)
      ) {
        // this is a step back; reverse the step by erasing the original path
        this.drawPath(this.myPath, this.cellVisitedBackground);
        this.myPath.pop();
      } else {
        this.myPath.push(nextCell);
        if (nextCell.equals(this.maze.lastCell)) {
          this.hooray();
          this.coverSwitch = false;
          this.allesOK = true;
          this.drawSolution(this.myPathColor, this.myPathThickness);
          this.cheated = false;
          return;
        }
      }

      this.drawPath(this.myPath);
      this.currentCell = nextCell;

      if (this.hole) {
        this.holeScope.activate();
        this.hole.position = new this.holeScope.Point(
          this.currentCell.col * this.cellSize + this.cellSize / 2,
          this.currentCell.row * this.cellSize + this.cellSize / 2);
        this.mazeScope.activate();
      }
    }
  }

  undo(nSteps = 5): void {
    if (!this.gameOver && this.myPath.length > nSteps) {
      this.drawPath(this.myPath, this.cellVisitedBackground);
      this.myPath.splice(-nSteps);
      this.drawPath(this.myPath);
      this.currentCell = this.myPath[this.myPath.length - 1];
      if (this.hole) {
        this.holeScope.activate();
        this.hole.position = new this.holeScope.Point(
          this.currentCell.col * this.cellSize + this.cellSize / 2,
          this.currentCell.row * this.cellSize + this.cellSize / 2);
        this.mazeScope.activate();
      }
      this.steps += 5;
    }
  }

  drawSolution(
    color = this.solutionPathColor,
    lineThickness = this.solutionPathThickness
  ): void {
    this.gameOver = true;
    this.allesOK = true;
    this.cheated = true;
    this.coverSwitch = false;
    this.drawPath(this.maze.findPath(), color, lineThickness, true);
  }

  private drawPath(
    path: Cell[],
    color = this.myPathColor,
    lineThickness = this.myPathThickness,
    drawSolution = false
  ): void {
    const draw = new this.mazeScope.Path(new this.mazeScope.Point(0, this.cellSize / 2));
    draw.strokeWidth = lineThickness;
    draw.strokeColor = new this.mazeScope.Color(color);

    path.forEach(x =>
      draw.add(new this.mazeScope.Point((x.col + 0.5) * this.cellSize, (x.row + 0.5) * this.cellSize))
    );
    if (drawSolution) {
      draw.add(new this.mazeScope.Point(this.col * this.cellSize, (this.row - 0.5) * this.cellSize));
    }
  }

  private draw(cell: Cell): void {
    const r1 = new this.mazeScope.Path.Rectangle(new this.mazeScope.Rectangle(cell.col * this.cellSize,
      cell.row * this.cellSize,
      (cell.col + 1) * this.cellSize,
      (cell.row + 1) * this.cellSize));
    r1.strokeWidth = this.cellEdgeThickness;
    r1.fillColor = new this.mazeScope.Color(this.cellBackground);
    if (cell.northEdge) {
      const ne = new this.mazeScope.Path(new this.mazeScope.Point(cell.col * this.cellSize, cell.row * this.cellSize));
      ne.strokeWidth = this.cellEdgeThickness;
      ne.strokeColor = new this.mazeScope.Color(this.myBorderColor);
      ne.add(new this.mazeScope.Point((cell.col + 1) * this.cellSize, cell.row * this.cellSize));
    }
    if (cell.eastEdge) {
      const ee = new this.mazeScope.Path(new this.mazeScope.Point((cell.col + 1) * this.cellSize, cell.row * this.cellSize));
      ee.strokeWidth = this.cellEdgeThickness;
      ee.strokeColor = new this.mazeScope.Color(this.myBorderColor);
      ee.add(new this.mazeScope.Point((cell.col + 1) * this.cellSize, (cell.row + 1) * this.cellSize));
    }
    if (cell.southEdge) {
      const se = new this.mazeScope.Path(new this.mazeScope.Point((cell.col + 1) * this.cellSize, (cell.row + 1) * this.cellSize));
      se.strokeWidth = this.cellEdgeThickness;
      se.strokeColor = new this.mazeScope.Color(this.myBorderColor);
      se.add(new this.mazeScope.Point(cell.col * this.cellSize, (cell.row + 1) * this.cellSize));
    }
    if (cell.westEdge) {
      const we = new this.mazeScope.Path(new this.mazeScope.Point(cell.col * this.cellSize, (cell.row + 1) * this.cellSize));
      we.strokeWidth = this.cellEdgeThickness;
      we.strokeColor = new this.mazeScope.Color(this.myBorderColor);
      we.add(new this.mazeScope.Point(cell.col * this.cellSize, cell.row * this.cellSize));
    }
  }

  private hooray(): void {
    const audio = new Audio('assets/KidsCheering.mp3');
    audio.play();
  }

  private validateInputs(): void {
    if (isNaN(this.row) || this.row < 1) {
      alert('Please enter a positive number for #Rows.');
      this.row = 15;
    }
    if (isNaN(this.col) || this.col < 1) {
      alert('Please enter a positive number for #Columns.');
      this.col = 15;
    }
    if (this.row > 500 || this.col > 500) {
      alert('Size too large. You may crash the browser...');
      this.row = 15;
      this.col = 15;
    }
    // tslint:disable-next-line:no-bitwise
    this.row = ~~this.row;
    // tslint:disable-next-line:no-bitwise
    this.col = ~~this.col;
  }

  test(): void {
    this.busy = true;
    const cellsHaveFourEdges: Cell[] = [];
    let hasLoop = false;
    const size = 50;
    for (let i = 0; i < 100; i++) {
      const maze = new Maze(size, size);
      maze.cells.forEach(row =>
        row.forEach(c => {
          if (c.nEdges === 4) {
            cellsHaveFourEdges.push(c);
          }
          if (c.col < size - 1 && c.row < size - 1) {
            if (!c.eastEdge && !c.southEdge) {
              const cellOnTheRight = maze.cells[c.row][c.col + 1];
              if (!cellOnTheRight.southEdge) {
                const cellBelow = maze.cells[c.row + 1][c.col];
                if (!cellBelow.eastEdge) {
                  hasLoop = true;
                }
              }
            }
          }
        })
      );
      if (cellsHaveFourEdges.length) {
        alert('dead loop');
        break;
      }
      if (hasLoop) {
        alert('open loop');
        break;
      }
    }

    console.log(`testing has finished`);
    this.busy = false;
  }

  toggleCover(): void {
    this.coverSwitch = !this.coverSwitch;
    if (!this.coverSwitch) {
      this.peaks++;
    }
  }

}
