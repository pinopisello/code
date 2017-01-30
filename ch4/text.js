let a = 2;

if (a > 1) {
    let b = a * 3;
    console.log( b );       // 6

    for (var i = a; i <= b; i++) {
        let j = i + 10;
        console.log( j );
    }
    // 12 13 14 15 16
    console.log( i); 
    let c = a + b;
    console.log( c );       // 8
}

console.log(b);