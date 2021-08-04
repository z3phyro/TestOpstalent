document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('bookings').onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const bookings = [];

            for (let i = 0; i < 100; i++) {
                bookings.push(new Array(50).fill(null));
            }

            const lines = e.target.result.split('\r\n');
            let rejected = 0;

            const bookingRegEx = /\(([0-9]+),([0-9]+):([0-9]+),([0-9]+):([0-9]+)\)?,/;

            for (let i = 0; i < lines.length; i++) {
                try {
                    // Parsing lines
                    let [, id, rowStart, rowStartFirst, rowEnd, rowEndLast] = bookingRegEx.exec(lines[i]);

                    id = Number(id);
                    rowStart = Number(rowStart);
                    rowStartFirst = Number(rowStartFirst);
                    rowEnd = Number(rowEnd);
                    rowEndLast = Number(rowEndLast);

                    // Different rows, not adjacent therefore not valid
                    if (rowStart !== rowEnd) {
                        rejected++;
                        continue;
                    }

                    const sitAmount = rowEndLast - rowStartFirst + 1;

                    // More than 5 sits not valid
                    if (sitAmount > 5) {
                        rejected++;
                        continue;
                    }

                    if (bookings[rowStart].slice(rowStartFirst, rowEndLast).every(sit => sit == null)) {
                        // Checking left side
                        if (
                            (rowStartFirst > 1 && bookings[rowStart][rowStartFirst - 1] === null && bookings[rowStart][rowStartFirst - 2] !== null) ||
                            (rowStartFirst === 1 && bookings[rowStart][rowStartFirst - 1] === null)
                        ) {
                            rejected++;
                            continue;
                        }

                        // Checking right side
                        if (
                            (rowEndLast < 48 && bookings[rowEnd][rowEndLast + 1] === null && bookings[rowEnd][rowEndLast + 2] !== null) ||
                            (rowEndLast === 48 && bookings[rowEnd][rowEndLast + 1] === null)
                        ) {
                            rejected++;
                            continue;
                        }

                        bookings[rowStart].splice(rowStartFirst, sitAmount, ...(new Array(sitAmount).fill(id)));
                    } else {
                        rejected++;
                    }
                } catch {
                    // Catch formatting issues or similar
                    rejected++;
                }
            }

            alert(`${rejected} Rejected Bookings`);
            console.log('REJECTED', rejected, bookings);
        };

        reader.readAsText(file);
    }
});