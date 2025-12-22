import { AkunBank } from "./akun";
import { Bank } from "./bank";

// Instance Bank
const BSI = new Bank("Bank Syariah Indonesia", "Jakarta")
const BCA = new Bank("Bank Central Asia", "SCBD")

// Instance Akun
const Ucup = new AkunBank(BSI, "Yusuf Ramadhani", 10000000, "111222333")
const John = new AkunBank(BCA, "John Doe", 10000000, "1230984576")

// BSI.getNama()
// BSI.getAlamat()
// BCA.getNama()
// BCA.getAlamat()

// Ucup.getNama()
// Ucup.getPemilik()
// Ucup.getSaldo()
// Ucup.getRekening()

// Ucup.deposit(15000000)
// Ucup.getSaldo()
// Ucup.tarik(1000000)
// Ucup.getSaldo()

Ucup.getSaldo()
Ucup.getRekening()
Ucup.nama