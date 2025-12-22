interface IBank {
    nama: string
    alamat: string

    getNama(): void
    getAlamat(): void
}

export class Bank implements IBank {
    public nama: string
    public alamat: string
    protected apalah: string
    private testing: string

    constructor(nama: string, alamat: string) {
        this.nama = nama
        this.alamat = alamat
        this.apalah = "au"
        this.testing = "asd"
    }

    getNama(): void {
        console.log(this.nama)
    }

    getAlamat() {
        console.log(this.alamat)
    }
}

