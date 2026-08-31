export interface WilayahItem {
  id: string;
  nama: string;
}

export interface KecamatanData {
  nama: string;
  kelurahan: string[];
}

export interface KotaData {
  nama: string;
  kecamatan: KecamatanData[];
}

export interface ProvinsiData {
  nama: string;
  kota: KotaData[];
}

export const DATA_WILAYAH_INDONESIA: ProvinsiData[] = [
  {
    nama: 'Jawa Barat',
    kota: [
      {
        nama: 'Kota Bandung',
        kecamatan: [
          { nama: 'Coblong', kelurahan: ['Dago', 'Lebak Siliwangi', 'Sadang Serang', 'Sekeloa', 'Cipaganti'] },
          { nama: 'Cicendo', kelurahan: ['Pasirkaliki', 'Arjuna', 'Husein Sastranegara', 'Pajajaran', 'Sukaraja'] },
          { nama: 'Lengkong', kelurahan: ['Burangrang', 'Cijagra', 'Cikawao', 'Lingkar Selatan', 'Malabar', 'Turangga'] },
          { nama: 'Sumur Bandung', kelurahan: ['Babakan Ciamis', 'Braga', 'Kebon Pisang', 'Merdeka'] },
          { nama: 'Sukasari', kelurahan: ['Gegerkalung', 'Isola', 'Sarijadi', 'Sukarasa'] },
          { nama: 'Bandung Wetan', kelurahan: ['Cihapit', 'Citarum', 'Taman Sari'] },
          { nama: 'Regol', kelurahan: ['Ancol', 'Balonggede', 'Ciateul', 'Cigereleng', 'Ciseureuh', 'Pasirluyu'] },
          { nama: 'Bojongloa Kaler', kelurahan: ['Babakan Asih', 'Babakan Tarogong', 'Jamika', 'Kopo', 'Suka Asih'] },
        ]
      },
      {
        nama: 'Kabupaten Bandung',
        kecamatan: [
          { nama: 'Soreang', kelurahan: ['Soreang', 'Panyirapan', 'Sekerame', 'Parungserab'] },
          { nama: 'Dayeuhkolot', kelurahan: ['Dayeuhkolot', 'Cangkuang Kulon', 'Pasawahan'] },
          { nama: 'Baleendah', kelurahan: ['Baleendah', 'Andir', 'Manggahang', 'Rancamanyar'] },
          { nama: 'Margahayu', kelurahan: ['Margahayu Selatan', 'Sayati', 'Sukamenak', 'Sulaiman'] },
          { nama: 'Cileunyi', kelurahan: ['Cileunyi Wetan', 'Cileunyi Kulon', 'Cimekar', 'Cinunuk'] }
        ]
      },
      {
        nama: 'Kota Bogor',
        kecamatan: [
          { nama: 'Bogor Tengah', kelurahan: ['Babakan', 'Paledang', 'Sempur', 'Cibogor'] },
          { nama: 'Bogor Timur', kelurahan: ['Baranangsiang', 'Katulampa', 'Sindangrasa'] },
          { nama: 'Bogor Utara', kelurahan: ['Cibuluh', 'Ciluar', 'Tegal Gundil'] }
        ]
      },
      {
        nama: 'Kota Depok',
        kecamatan: [
          { nama: 'Pancoran Mas', kelurahan: ['Depok', 'Depok Jaya', 'Pancoran Mas', 'Ratu Jaya'] },
          { nama: 'Beji', kelurahan: ['Beji', 'Beji Timur', 'Kukusan', 'Pondok Cina'] },
          { nama: 'Cimanggis', kelurahan: ['Cisalak Pasar', 'Curug', 'Harjamukti', 'Tugu'] }
        ]
      },
      {
        nama: 'Kota Bekasi',
        kecamatan: [
          { nama: 'Bekasi Timur', kelurahan: ['Bekasi Jaya', 'Duren Jaya', 'Margahayu'] },
          { nama: 'Bekasi Selatan', kelurahan: ['Jatibening', 'Kayuringin Jaya', 'Pekayon Jaya'] },
          { nama: 'Bekasi Barat', kelurahan: ['Bintara', 'Kranji', 'Kota Baru'] }
        ]
      }
    ]
  },
  {
    nama: 'DKI Jakarta',
    kota: [
      {
        nama: 'Kota Jakarta Selatan',
        kecamatan: [
          { nama: 'Kebayoran Baru', kelurahan: ['Gandrung Selatan', 'Melawai', 'Pulo', 'Rawa Barat', 'Senayan'] },
          { nama: 'Cilandak', kelurahan: ['Cilandak Barat', 'Cipete Selatan', 'Gandaria Selatan', 'Pondok Labu'] },
          { nama: 'Pasar Minggu', kelurahan: ['Cilandak Timur', 'Jati Padang', 'Pasar Minggu', 'Pejaten Barat'] },
          { nama: 'Setiabudi', kelurahan: ['Guntur', 'Karet', 'Kuningan Timur', 'Setiabudi'] },
          { nama: 'Tebet', kelurahan: ['Bukit Duri', 'Kebon Baru', 'Manggarai', 'Tebet Barat'] }
        ]
      },
      {
        nama: 'Kota Jakarta Pusat',
        kecamatan: [
          { nama: 'Gambir', kelurahan: ['Cideng', 'Gambir', 'Kebon Kelapa', 'Petojo Selatan'] },
          { nama: 'Tanah Abang', kelurahan: ['Bendungan Hilir', 'Gelora', 'Kampung Bali', 'Karet Tengsin'] },
          { nama: 'Menteng', kelurahan: ['Cikini', 'Gondangdia', 'Menteng', 'Pegangsaan'] },
          { nama: 'Senen', kelurahan: ['Kramat', 'Kwitang', 'Paseban', 'Senen'] }
        ]
      },
      {
        nama: 'Kota Jakarta Timur',
        kecamatan: [
          { nama: 'Jatinegara', kelurahan: ['Bali Mester', 'Bidara Cina', 'Cipinang Cempedak', 'Kampung Melayu'] },
          { nama: 'Duren Sawit', kelurahan: ['Duren Sawit', 'Klender', 'Pondok Bambu', 'Pondok Kelapa'] },
          { nama: 'Matraman', kelurahan: ['Kayu Manis', 'Kebon Manggis', 'Pal Meriam', 'Pisangan Baru'] }
        ]
      },
      {
        nama: 'Kota Jakarta Barat',
        kecamatan: [
          { nama: 'Grogol Petamburan', kelurahan: ['Grogol', 'Jelambar', 'Tanjung Duren Utara'] },
          { nama: 'Kebon Jeruk', kelurahan: ['Duri Kepa', 'Kedoya Selatan', 'Kelapa Dua'] },
          { nama: 'Palmerah', kelurahan: ['Jatipulo', 'Kota Bambu Selatan', 'Palmerah', 'Slipi'] }
        ]
      },
      {
        nama: 'Kota Jakarta Utara',
        kecamatan: [
          { nama: 'Kelapa Gading', kelurahan: ['Kelapa Gading Barat', 'Kelapa Gading Timur', 'Pegangsaan Dua'] },
          { nama: 'Tanjung Priok', kelurahan: ['Kebon Bawang', 'Papanggo', 'Sunung Giri', 'Sunter Agung'] }
        ]
      }
    ]
  },
  {
    nama: 'Jawa Tengah',
    kota: [
      {
        nama: 'Kota Semarang',
        kecamatan: [
          { nama: 'Semarang Tengah', kelurahan: ['Brumbungan', 'Gabus', 'Kranggan', 'Miroto', 'Pandansari'] },
          { nama: 'Semarang Barat', kelurahan: ['Bojongsalaman', 'Cabean', 'Krobokan', 'Tawangsari'] },
          { nama: 'Banyumanik', kelurahan: ['Banyumanik', 'Gedawang', 'Jabungan', 'Ngesrep', 'Padangsari'] }
        ]
      },
      {
        nama: 'Kota Surakarta (Solo)',
        kecamatan: [
          { nama: 'Banjarsari', kelurahan: ['Banyuanyar', 'Kadipiro', 'Kestalan', 'Manahan', 'Nusukan'] },
          { nama: 'Jebres', kelurahan: ['Gandekan', 'Jagalan', 'Jebres', 'Mojosongo', 'Purwodiningratan'] },
          { nama: 'Laweyan', kelurahan: ['Bumi', 'Jawi', 'Kerten', 'Laweyan', 'Penumping'] }
        ]
      },
      {
        nama: 'Kabupaten Banyumas',
        kecamatan: [
          { nama: 'Purwokerto Timur', kelurahan: ['Arcawinangun', 'Kranji', 'Mersi', 'Purwokerto Lor'] },
          { nama: 'Purwokerto Barat', kelurahan: ['Bantarsoka', 'Karanglewas Lor', 'Kedungwringin'] }
        ]
      }
    ]
  },
  {
    nama: 'Jawa Timur',
    kota: [
      {
        nama: 'Kota Surabaya',
        kecamatan: [
          { nama: 'Tegalsari', kelurahan: ['Dr. Soetomo', 'Kedungdoro', 'Keputran', 'Tegalsari', 'Wonorejo'] },
          { nama: 'Gubeng', kelurahan: ['Airlangga', 'Baratajaya', 'Gubeng', 'Kertajaya', 'Mojo'] },
          { nama: 'Wonokromo', kelurahan: ['Darmo', 'Jagir', 'Ngagel', 'Wonokromo'] },
          { nama: 'Sukolilo', kelurahan: ['Keputih', 'Klampis Ngasem', 'Medokan Semampir', 'Nginden Jangkungan'] }
        ]
      },
      {
        nama: 'Kota Malang',
        kecamatan: [
          { nama: 'Klojen', kelurahan: ['Bareng', 'Gadingkasri', 'Kasenbon', 'Kauman', 'Klojen', 'Oro-Oro Dowo'] },
          { nama: 'Lowokwaru', kelurahan: ['Dinoyo', 'Jatimulyo', 'Ketawanggede', 'Lowokwaru', 'Sumbersari'] },
          { nama: 'Blimbing', kelurahan: ['Arjosari', 'Blimbing', 'Bunulrejo', 'Polowijen'] }
        ]
      }
    ]
  },
  {
    nama: 'Banten',
    kota: [
      {
        nama: 'Kota Tangerang',
        kecamatan: [
          { nama: 'Tangerang', kelurahan: ['Babakan', 'Buaran Indah', 'Cikokol', 'Suka Asih', 'Sukarasa'] },
          { nama: 'Karawaci', kelurahan: ['Bojong Jaya', 'Bugel', 'Cimone', 'Karawaci', 'Margasari'] },
          { nama: 'Ciledug', kelurahan: ['Paninggilan', 'Parung Serab', 'Sudimara Barat'] }
        ]
      },
      {
        nama: 'Kota Tangerang Selatan',
        kecamatan: [
          { nama: 'Serpong', kelurahan: ['Lengkong Gudang', 'Lengkong Karya', 'Rawa Buntu', 'Serpong'] },
          { nama: 'Pondok Aren', kelurahan: ['Jurang Mangu Barat', 'Pondok Aren', 'Pondok Betung', 'Pondok Karya'] },
          { nama: 'Ciputat', kelurahan: ['Cipayung', 'Ciputat', 'Jombang', 'Sawah Baru'] }
        ]
      }
    ]
  },
  {
    nama: 'DI Yogyakarta',
    kota: [
      {
        nama: 'Kota Yogyakarta',
        kecamatan: [
          { nama: 'Gondomanan', kelurahan: ['Ngupasan', 'Prawirodirjan'] },
          { nama: 'Umbulharjo', kelurahan: ['Giwangan', 'Muja Muju', 'Pandeyan', 'Semaki', 'Tahunan'] },
          { nama: 'Danurejan', kelurahan: ['Bausasran', 'Tegal Panggung', 'Suryatmajan'] }
        ]
      },
      {
        nama: 'Kabupaten Sleman',
        kecamatan: [
          { nama: 'Depok', kelurahan: ['Caturtunggal', 'Condongcatur', 'Mangunharjo'] },
          { nama: 'Mlati', kelurahan: ['Sinduadi', 'Sendangadi', 'Sumberadi'] },
          { nama: 'Ngaglik', kelurahan: ['Donoharjo', 'Minomartani', 'Sardonoharjo', 'Sukoharjo'] }
        ]
      }
    ]
  },
  {
    nama: 'Sumatra Utara',
    kota: [
      {
        nama: 'Kota Medan',
        kecamatan: [
          { nama: 'Medan Kota', kelurahan: ['Mesjid', 'Pandau Hulu I', 'Passar Merah Kota', 'Siti Rejo I'] },
          { nama: 'Medan Petisah', kelurahan: ['Petisah Tengah', 'Sekip', 'Sei Putih Barat'] },
          { nama: 'Medan Helvetia', kelurahan: ['Cinta Damai', 'Dwikora', 'Helvetia', 'Helvetia Tengah'] }
        ]
      }
    ]
  },
  {
    nama: 'Bali',
    kota: [
      {
        nama: 'Kota Denpasar',
        kecamatan: [
          { nama: 'Denpasar Selatan', kelurahan: ['Panjer', 'Pedungan', 'Pemogan', 'Renon', 'Sanur'] },
          { nama: 'Denpasar Barat', kelurahan: ['Dauh Puri', 'Padangsambian', 'Pemecutan'] },
          { nama: 'Denpasar Utara', kelurahan: ['Peguyangan', 'Tonja', 'Ubung'] }
        ]
      },
      {
        nama: 'Kabupaten Badung',
        kecamatan: [
          { nama: 'Kuta', kelurahan: ['Kedonganan', 'Kuta', 'Legian', 'Seminyak', 'Tuban'] },
          { nama: 'Mengwi', kelurahan: ['Canggu', 'Kapal', 'Lukluk', 'Mengwi', 'Sembung'] }
        ]
      }
    ]
  },
  {
    nama: 'Sulawesi Selatan',
    kota: [
      {
        nama: 'Kota Makassar',
        kecamatan: [
          { nama: 'Ujung Pandang', kelurahan: ['Baru', 'Bulogading', 'Lajanguru', 'Maloku', 'Mangkura'] },
          { nama: 'Panakkukang', kelurahan: ['Karampuang', 'Masale', 'Pampang', 'Paropo', 'Tamamaung'] },
          { nama: 'Tamalate', kelurahan: ['Bongaya', 'Jongaya', 'Maccini Sombala', 'Mangasa', 'Parang Tambung'] }
        ]
      }
    ]
  }
];
