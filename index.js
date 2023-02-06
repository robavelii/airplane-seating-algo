import { EOL } from 'os';
import { red, green, blue, white, bold } from 'colorette';
import path from 'path';
import { fileURLToPath } from 'url';
let key, passenger;
const SeatColor = {
  Aisle: blue,
  Window: green,
  Center: red,
};

const Menu = [
  `${green('■')} Window`,
  `${red('■')} Middle`,
  `${blue('■')} Aisle`,
  `${white('■')} Empty`,
];

// const seatType = 'Aisle' | 'Window' | 'Center';
// const SeatConfig = [];
// const SeatMap = {
//   key: SeatType,
// };

// const AssignmentMap = {
//   key: {
//     SeatType,
//     passenger,
//   },
// };

export const buildSeat = (SeatConfig) => {
  let seats = {};
  const rows = SeatConfig.map((arr) => arr[1]);
  for (
    let rowIndex = 0, rowLength = rows.length;
    rowIndex < rowLength;
    rowIndex++
  ) {
    for (
      let colIndex = 0, length = SeatConfig.length;
      colIndex < length;
      colIndex++
    ) {
      if (rowIndex < SeatConfig[colIndex][1]) {
        const colSeatMap = SeatConfig[colIndex];
        const columns = colSeatMap[0];
        for (
          let innerColIndex = 0, colLength = columns;
          innerColIndex < colLength;
          innerColIndex++
        ) {
          let seatType;
          if (colIndex === 0) {
            // left corner
            if (innerColIndex === 0) {
              seatType = 'Window';
            } else if (innerColIndex === colLength - 1) {
              seatType = 'Aisle';
            } else {
              seatType = 'Center';
            }
          } else if (colIndex === length - 1) {
            // right corner
            if (innerColIndex === 0) {
              seatType = 'Aisle';
            } else if (innerColIndex === colLength - 1) {
              seatType = 'Window';
            } else {
              seatType = 'Center';
            }
          } else {
            // Middle
            if (innerColIndex === 0 || innerColIndex === colLength - 1) {
              seatType = 'Aisle';
            } else {
              seatType = 'Center';
            }
          }
          seats[`${colIndex}_${innerColIndex}_${rowIndex}`] = seatType;
        }
      }
    }
  }
  return seats;
};
export const filterSeats = (SeatMap, SeatType) => {
  return Object.entries(SeatMap).filter((arr) => arr[1] === SeatType);
};
export const assignSeats = (SeatMap, passenger, priority) => {
  if (priority === void 0) {
    priority = ['Aisle', 'Window', 'Center'];
  }
  let assignmentMap = {};
  let order = [];

  //   console.log('assigSeats: ', SeatMap, passenger);
  priority.forEach((priority) => {
    order = order.concat(filterSeats(SeatMap, priority));
  });
  order.slice(0, passenger).forEach((item, index) => {
    assignmentMap[item[0]] = {
      seatType: SeatMap[item[0]],
      passengerNumber: index,
    };
    // console.log('inside assignSeat: ', assignmentMap);
  });
  return assignmentMap;
};

export const printSeats = (SeatConfig, assignmentMap) => {
  console.log(`${EOL}* This is your 🫡  speaking ✈️  *${EOL}`);
  const rows = SeatConfig.map((arr) => arr[1]);
  for (
    let rowIndex = 0, rowLength = rows.length;
    rowIndex < rowLength;
    rowIndex++
  ) {
    let row = [];
    for (
      let colIndex = 0, length = SeatConfig.length;
      colIndex < length;
      colIndex++
    ) {
      const colSeatMap = SeatConfig[colIndex];
      const columns = colSeatMap[0];
      if (rowIndex < SeatConfig[colIndex][1]) {
        for (
          let innerColIndex = 0, colLength = columns;
          innerColIndex < colLength;
          innerColIndex++
        ) {
          let seatNumber = `${colIndex}_${innerColIndex}_${rowIndex}`;
          let seat = assignmentMap[seatNumber];
          if (seat) {
            row.push(
              SeatColor[seat.seatType](
                (seat.passengerNumber + 1).toString().padStart(2)
              )
            );
          } else {
            row.push(white('■'.padStart(2)));
          }
        }
      } else {
        row.push('--|'.repeat(columns));
      }
      row.push('    ');
    }
    console.log(
      row
        .map((r) => {
          if (r.endsWith('|')) {
            return r.slice(0, r.length - 1);
          }
          return r;
        })
        .join('|')
    );
  }
  console.log(`${EOL}${bold('Menu')}`);
  console.log(Menu.join('\t'));
  console.log(EOL);
};

//If run as CLI.

const nodePath = path.resolve(process.argv[1]);
const modulePath = path.resolve(fileURLToPath(import.meta.url));
const isRunningDirectlyViaCLI = nodePath === modulePath;
if (isRunningDirectlyViaCLI) {
  const args = process.argv;
  if (args.length !== 4) {
    console.error(
      `Usage: node index.js <seat_layout> <passengers_count>${EOL}Example: node index.js "[[3,2],[4,3],[2,3],[3,4]]" "30"`
    );
    process.exit(1);
  }

  try {
    let seatConfig = JSON.parse(args[2]);
    let passenger = parseInt(args[3], 10);
    if (typeof passenger !== 'number' || isNaN(passenger)) {
      throw new TypeError();
    }
    // console.log(seatConfig);
    let seatMap = buildSeat(seatConfig);
    // console.log('SeatMap: ', seatMap);
    // console.log('Passenger: ', passenger);
    let assignmentMap = assignSeats(seatMap, passenger);
    // console.log('AssignmentMap: ', assignmentMap);
    printSeats(seatConfig, assignmentMap);
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error(
        'Error parsing seat layout configuration. Please make sure it is valid JSON!'
      );
    } else if (err instanceof TypeError) {
      console.error(
        'Invalid passenger count. Please make sure it is a valid integer!'
      );
    } else {
      console.error(err);
    }
    process.exit(1);
  }
}
