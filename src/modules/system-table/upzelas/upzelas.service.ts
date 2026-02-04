import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpzelaEntity } from './entities/upzelas.entity';
import { DistrictEntity } from '../districts/entities/districts.entity';

@Injectable()
export class UpzelaService implements OnModuleInit {
  constructor(
    @InjectRepository(UpzelaEntity)
    private readonly upazilaRepository: Repository<UpzelaEntity>,
    @InjectRepository(DistrictEntity)
    private readonly districtRepository: Repository<DistrictEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    const upazilaData = [
      // DHAKA
      { district: 'Dhaka', names: ['Dhamrai', 'Dohar', 'Keraniganj', 'Nawabganj', 'Savar'] },
      { district: 'Gazipur', names: ['Gazipur Sadar', 'Kaliakair', 'Kaliganj', 'Kapasia', 'Sreepur'] },
      { district: 'Narayanganj', names: ['Araihazar', 'Bandar', 'Narayanganj Sadar', 'Rupganj', 'Sonargaon'] },
      { district: 'Narsingdi', names: ['Belabo', 'Monohardi', 'Narsingdi Sadar', 'Palash', 'Raipura', 'Shibpur'] },
      { district: 'Manikganj', names: ['Daulatpur', 'Ghior', 'Harirampur', 'Manikganj Sadar', 'Saturia', 'Shivalaya', 'Singair'] },
      { district: 'Munshiganj', names: ['Gazaria', 'Louhajang', 'Munshiganj Sadar', 'Sirajdikhan', 'Sreenagar', 'Tongibari'] },
      { district: 'Tangail', names: ['Basail', 'Bhuapur', 'Delduar', 'Dhanbari', 'Ghatail', 'Gopalpur', 'Kalihati', 'Madhupur', 'Mirzapur', 'Nagarpur', 'Sakhipur', 'Tangail Sadar'] },
      { district: 'Kishoreganj', names: ['Austagram', 'Bajitpur', 'Bhairab', 'Hossainpur', 'Itna', 'Karimganj', 'Katiadi', 'Kishoreganj Sadar', 'Kuliarchar', 'Mithamain', 'Nikli', 'Pakundia', 'Tarail'] },
      { district: 'Faridpur', names: ['Alfadanga', 'Bhanga', 'Boalmari', 'Charbhadrasan', 'Faridpur Sadar', 'Madhukhali', 'Nagarkanda', 'Sadarpur', 'Saltha'] },
      { district: 'Gopalganj', names: ['Gopalganj Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara'] },
      { district: 'Madaripur', names: ['Kalkini', 'Madaripur Sadar', 'Rajoir', 'Shibchar'] },
      { district: 'Rajbari', names: ['Baliakandi', 'Goalandaghat', 'Pangsha', 'Rajbari Sadar', 'Kalukhali'] },
      { district: 'Shariatpur', names: ['Bhedarganj', 'Damudya', 'Gosairhat', 'Naria', 'Shariatpur Sadar', 'Zajira'] },
      // CHATTOGRAM
      { district: 'Chattogram', names: ['Anwara', 'Banskhali', 'Boalkhali', 'Chandanaish', 'Fatickchhari', 'Hathazari', 'Lohagara', 'Mirsharai', 'Patiya', 'Rangunia', 'Raozan', 'Sandwip', 'Satkania', 'Sitakunda'] },
      { district: 'Cox’s Bazar', names: ['Chakaria', 'Cox’s Bazar Sadar', 'Kutubdia', 'Maheshkhali', 'Ramu', 'Teknaf', 'Ukhia', 'Pekua'] },
      { district: 'Cumilla', names: ['Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Muradnagar', 'Nangalkot', 'Cumilla Sadar', 'Meghna', 'Monohargonj', 'Sadar South', 'Titas'] },
      { district: 'Noakhali', names: ['Begumganj', 'Chatkhil', 'Companiganj', 'Hatiya', 'Senbagh', 'Noakhali Sadar', 'Subarnachar', 'Sonaimuri', 'Kabirhat'] },
      { district: 'Feni', names: ['Chhagalnaiya', 'Daganbhuiyan', 'Feni Sadar', 'Parshuram', 'Sonagazi', 'Fulgazi'] },
      { district: 'Lakshmipur', names: ['Lakshmipur Sadar', 'Raipur', 'Ramganj', 'Ramgati', 'Kamalnagar'] },
      { district: 'Brahmanbaria', names: ['Brahmanbaria Sadar', 'Ashuganj', 'Bancharampur', 'Kasba', 'Nabinagar', 'Nasirnagar', 'Sarail', 'Bijoynagar', 'Akhaura'] },
      { district: 'Chandpur', names: ['Chandpur Sadar', 'Faridganj', 'Haimchar', 'Haziganj', 'Kachua', 'Matlab North', 'Matlab South', 'Shahrasti'] },
      { district: 'Khagrachari', names: ['Dighinala', 'Khagrachari Sadar', 'Lakshmichhari', 'Mahalchhari', 'Manikchhari', 'Matiranga', 'Panchhari', 'Ramgarh'] },
      { district: 'Rangamati', names: ['Bagaichhari', 'Barkal', 'Kawkhali', 'Belaichhari', 'Kaptai', 'Jurachhari', 'Langadu', 'Naniarchar', 'Rajasthali', 'Rangamati Sadar'] },
      { district: 'Bandarban', names: ['Bandarban Sadar', 'Ali Kadam', 'Lama', 'Naikhongchhari', 'Rowangchhari', 'Ruma', 'Thanchi'] },
      // RAJSHAHI
      { district: 'Rajshahi', names: ['Bagha', 'Bagmara', 'Charghat', 'Durgapur', 'Godagari', 'Mohanpur', 'Paba', 'Puthia', 'Tanore'] },
      { district: 'Natore', names: ['Natore Sadar', 'Baraigram', 'Bagatipara', 'Lalpur', 'Singra', 'Gurudaspur', 'Naldanga'] },
      { district: 'Naogaon', names: ['Atrai', 'Badalgachhi', 'Dhamoirhat', 'Manda', 'Mahadevpur', 'Naogaon Sadar', 'Niamatpur', 'Patnitala', 'Porsha', 'Raninagar', 'Sapahar'] },
      { district: 'Chapainawabganj', names: ['Bholahat', 'Gomastapur', 'Nachole', 'Chapainawabganj Sadar', 'Shibganj'] },
      { district: 'Bogura', names: ['Adamdighi', 'Bogura Sadar', 'Dhunat', 'Dhupchanchia', 'Gabtali', 'Kahaloo', 'Nandigram', 'Sariakandi', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Sonatola'] },
      { district: 'Joypurhat', names: ['Akkelpur', 'Joypurhat Sadar', 'Kalai', 'Khetlal', 'Panchbibi'] },
      { district: 'Sirajganj', names: ['Belkuchi', 'Chauhali', 'Kamarkhanda', 'Kazipur', 'Raiganj', 'Shahjadpur', 'Sirajganj Sadar', 'Tarash', 'Ullahpara'] },
      { district: 'Pabna', names: ['Atgharia', 'Bera', 'Bhangura', 'Chatmohar', 'Faridpur', 'Ishwardi', 'Pabna Sadar', 'Santhia', 'Sujanagar'] },
      // KHULNA
      { district: 'Khulna', names: ['Batiaghata', 'Dacope', 'Dumuria', 'Dighalia', 'Koyra', 'Paikgachha', 'Phultala', 'Rupsha', 'Terokhada'] },
      { district: 'Jessore', names: ['Abhaynagar', 'Bagherpara', 'Chaugachha', 'Jessore Sadar', 'Jhikargachha', 'Keshabpur', 'Manirampur', 'Sharsha'] },
      { district: 'Satkhira', names: ['Assasuni', 'Debhata', 'Kalaroa', 'Kaliganj', 'Satkhira Sadar', 'Shyamnagar', 'Tala'] },
      { district: 'Bagerhat', names: ['Bagerhat Sadar', 'Chitalmari', 'Fakirhat', 'Kachua', 'Mollahat', 'Mongla', 'Morrelganj', 'Rampal', 'Sarankhola'] },
      { district: 'Jhenaidah', names: ['Harinakunda', 'Jhenaidah Sadar', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa'] },
      { district: 'Narail', names: ['Kalia', 'Lohagara', 'Narail Sadar'] },
      { district: 'Magura', names: ['Magura Sadar', 'Mohammadpur', 'Shalikha', 'Sreepur'] },
      { district: 'Kushtia', names: ['Bheramara', 'Daulatpur', 'Khoksa', 'Kumarkhali', 'Kushtia Sadar', 'Mirpur'] },
      { district: 'Chuadanga', names: ['Alamdanga', 'Chuadanga Sadar', 'Damurhuda', 'Jiban Nagar'] },
      { district: 'Meherpur', names: ['Gangni', 'Meherpur Sadar', 'Mujibnagar'] },
      // BARISHAL
      { district: 'Barishal', names: ['Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara', 'Gaurnadi', 'Hizla', 'Barishal Sadar', 'Mehendiganj', 'Muladi', 'Wazirpur'] },
      { district: 'Bhola', names: ['Bhola Sadar', 'Burhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura', 'Tazumuddin'] },
      { district: 'Patuakhali', names: ['Bauphal', 'Dashmina', 'Galachipa', 'Kalapara', 'Mirzaganj', 'Patuakhali Sadar', 'Rangabali', 'Dumki'] },
      { district: 'Pirojpur', names: ['Bhandaria', 'Kawkhali', 'Mathbaria', 'Nazirpur', 'Pirojpur Sadar', 'Nesarabad', 'Indurkani'] },
      { district: 'Jhalokathi', names: ['Jhalokathi Sadar', 'Kathalia', 'Nalchity', 'Rajapur'] },
      { district: 'Barguna', names: ['Amtali', 'Bamna', 'Barguna Sadar', 'Betagi', 'Patharghata', 'Taltali'] },
      // SYLHET
      { district: 'Sylhet', names: ['Balaganj', 'Beanibazar', 'Bishwanath', 'Fenchuganj', 'Golapganj', 'Gowainghat', 'Jaintiapur', 'Kanaighat', 'Sylhet Sadar', 'Zakiganj', 'South Surma', 'Osmani Nagar'] },
      { district: 'Moulvibazar', names: ['Barlekha', 'Kamalganj', 'Kulaura', 'Moulvibazar Sadar', 'Rajnagar', 'Sreemangal', 'Juri'] },
      { district: 'Habiganj', names: ['Ajmiriganj', 'Bahubal', 'Baniyachong', 'Chunarughat', 'Habiganj Sadar', 'Lakhai', 'Madhabpur', 'Nabiganj', 'Sayestaganj'] },
      { district: 'Sunamganj', names: ['Bishwamarpur', 'Chhatak', 'Derai', 'Dharampasha', 'Dowarabazar', 'Jagannathpur', 'Jamalganj', 'Sullah', 'Sunamganj Sadar', 'Tahirpur', 'South Sunamganj'] },
      // RANGPUR
      { district: 'Rangpur', names: ['Badarganj', 'Gangachara', 'Kaunia', 'Rangpur Sadar', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj'] },
      { district: 'Dinajpur', names: ['Birampur', 'Birganj', 'Biral', 'Bochaganj', 'Chirirbandar', 'Phulbari', 'Ghoraghat', 'Hakimpur', 'Kaharole', 'Khansama', 'Dinajpur Sadar', 'Nawabganj', 'Parbatipur'] },
      { district: 'Thakurgaon', names: ['Baliadangi', 'Haripur', 'Pirganj', 'Ranisankail', 'Thakurgaon Sadar'] },
      { district: 'Panchagarh', names: ['Atwari', 'Boda', 'Debiganj', 'Panchagarh Sadar', 'Tetulia'] },
      { district: 'Nilphamari', names: ['Dimla', 'Domar', 'Jaldhaka', 'Kishoreganj', 'Nilphamari Sadar', 'Saidpur'] },
      { district: 'Lalmonirhat', names: ['Aditmari', 'Hatibandha', 'Kaliganj', 'Lalmonirhat Sadar', 'Patgram'] },
      { district: 'Kurigram', names: ['Bhurungamari', 'Char Rajibpur', 'Chilmari', 'Phulbari', 'Kurigram Sadar', 'Nageshwari', 'Rajarhat', 'Roumari', 'Ulipur'] },
      { district: 'Gaibandha', names: ['Phulchhari', 'Gaibandha Sadar', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Saghata', 'Sundarganj'] },
      // MYMENSINGH
      { district: 'Mymensingh', names: ['Bhaluka', 'Dhobaura', 'Fulbaria', 'Gaffargaon', 'Gauripur', 'Haluaghat', 'Ishwarganj', 'Mymensingh Sadar', 'Muktagachha', 'Nandail', 'Phulpur', 'Trishal', 'Tara Khanda'] },
      { district: 'Jamalpur', names: ['Bakshiganj', 'Dewanganj', 'Islampur', 'Jamalpur Sadar', 'Madarganj', 'Melandaha', 'Sarishabari'] },
      { district: 'Sherpur', names: ['Jhenaigati', 'Nakla', 'Nalitabari', 'Sherpur Sadar', 'Sreebardi'] },
      { district: 'Netrokona', names: ['Atpara', 'Barhatta', 'Durgapur', 'Khaliajuri', 'Kalmakanda', 'Kendua', 'Madan', 'Mohanganj', 'Netrokona Sadar', 'Purbadhala'] },
    ];

    const districts = await this.districtRepository.find();
    const districtMapLookup = new Map(districts.map(d => [d.name, d]));

    // Added optional chaining (?.) and null check to prevent crash if data is dirty
    const existingUpazilas = await this.upazilaRepository.find({ relations: ['district'] });
    const existingSet = new Set(
      existingUpazilas
        .filter(u => u.district !== null) // Safety filter
        .map(u => `${u.name}-${u.district.id}`)
    );

    const newUpazilas: UpzelaEntity[] = [];

    for (const group of upazilaData) {
      const district = districtMapLookup.get(group.district);
      if (!district) continue;

      for (const name of group.names) {
        if (!existingSet.has(`${name}-${district.id}`)) {
          const upzela = this.upazilaRepository.create({ name, district });
          newUpazilas.push(upzela);
        }
      }
    }

    if (newUpazilas.length) {
      await this.upazilaRepository.save(newUpazilas, { chunk: 100 });
    }
  }

  async findAll(): Promise<UpzelaEntity[]> {
    return this.upazilaRepository.find({
      relations: ['district'],
      order: { name: 'ASC' },
    });
  }
}