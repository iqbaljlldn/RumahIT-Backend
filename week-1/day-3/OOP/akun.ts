import { Bank } from "./bank";

export class AkunBank extends Bank {
    public constructor(
        public bank: Bank,
        public pemilik: string,
        private saldo: number,
        protected noRekening: string,
    ) {
        super(bank.nama, bank.alamat)
    }

    getPemilik() {
        this.apalah
        // this.testing // error private
        console.log(this.pemilik)
    }

    getSaldo() {
        console.log(this.saldo)
    }

    getRekening() {
        console.log(this.noRekening)
    }

    deposit(jumlah: number) {
        if (jumlah <= 0) {
            return console.error("Jumlah deposit harus lebih dari 0")
        }

        this.saldo += jumlah
    }

    tarik(jumlah: number) {
        if (jumlah > this.saldo) {
            return console.error("Saldo tidak cukup")
        }

        this.saldo -= jumlah
    }
}