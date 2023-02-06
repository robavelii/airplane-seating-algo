# Airplane Seating Aglorithm built for an interview

![alt text](https://github.com/[robavelii]/[airplane-seating-algo]/[main]/image.jpg?raw=true)

A simple node.js program that helps seat audiences in a flight based on the following input and rules.

## Rules for seating

    • Always seat passengers starting from the front row to back, starting from the left to the right
    • Fill aisle seats first followed by window seats followed by center seats (any order in center seats)

## Input to the program will be

    • a 2D array that represents the rows and columns [[3,4],[4,5],[2,3],[3,4]]
    • Number of passengers waitng in queue.

# How to build and run

git clone https://github.com/robavelii/airplane-seating-algo
cd ariplane-seating-algo
npm install
Input: "<seat_layout>" "<passengers_count>"
Example: node index.js "[[3,2],[4,3],[2,3],[3,4]]" "30"
