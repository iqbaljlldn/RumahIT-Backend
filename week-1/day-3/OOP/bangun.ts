abstract class Shape {
    abstract hitungLuas(): number
    abstract hitungKeliling(): number

    deskripsi() {
        return `Luas: ${this.hitungLuas()}, Keliling: ${this.hitungKeliling()}`
    }
}

export class Persegi extends Shape {
    constructor(private sisi: number) {
        super()
    }

    hitungLuas(): number {
        return this.sisi * this.sisi
    }

    hitungKeliling(): number {
        return this.sisi * 4
    }
}

export class Lingkaran extends Shape {
    constructor(private radius: number) {
        super();
    }

    hitungLuas(): number {
        return Math.PI * this.radius ** 2;
    }

    hitungKeliling(): number {
        return 2 * Math.PI * this.radius;
    }
}

const persegi = new Persegi(5)
const lingkaran = new Lingkaran(15)
console.log(lingkaran.deskripsi())
console.log(lingkaran.hitungKeliling())
console.log(lingkaran.hitungLuas())