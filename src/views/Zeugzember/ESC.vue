<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Contestant {
  name: string;
  artist: string;
  year: number;
  image: string;
  audio: string;
}

const GERMAN_CONTESTANTS: Contestant[] = [
  { "name": "Im Wartesaal zum großen Glück", "artist": "Walter Andreas Schwarz", "year": 1956, "image": "https://static.wikia.nocookie.net/eurosong-contest/images/3/3b/ImWartesaalzumgro%C3%9FenGl%C3%BCck.jpg/revision/latest/thumbnail/width/360/height/450?cb=20150821113902", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/24/fc/4a/24fc4a36-cbe3-7ed0-068b-4ba387108994/mzaf_17473719529627375730.plus.aac.ep.m4a" },
    { "name": "So geht das jede Nacht", "artist": "Freddy Quinn", "year": 1956, "image": "https://upload.wikimedia.org/wikipedia/de/b/bd/Polydor_NH_23_223_B_Freddy_%28Quinn%29_001.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/76/67/f8/7667f8fd-acef-49e5-959e-7d72a02166ee/mzaf_12355978826715421118.plus.aac.p.m4a" },
    { "name": "Telefon, Telefon", "artist": "Margot Hielscher", "year": 1957, "image": "https://media.hitparade.ch/cover/800/margot_hielscher-telefon_telefon_s.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e1/b8/c0/e1b8c006-fadc-1904-3a6a-b1c1b9f01dfa/mzaf_5043056250600607488.plus.aac.ep.m4a" },
    { "name": "Für zwei Groschen Musik", "artist": "Margot Hielscher", "year": 1958, "image": "https://media.hitparade.ch/cover/800/margot_hielscher-fuer_2_groschen_musik_s.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview113/v4/8b/86/37/8b863745-23fd-2e12-38da-1248c764fb74/mzaf_3538182324533661554.plus.aac.ep.m4a" },
    { "name": "Heute Abend wollen wir tanzen geh'n", "artist": "Alice & Ellen Kessler", "year": 1959, "image": "https://media.hitparade.ch/cover/800/alice_ellen_kessler-heute_abend_wollen_wir_tanzen_gehn_s.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/2c/2a/3b/2c2a3bab-9dfb-dc6d-2a82-cc72dc1b4490/mzaf_1108176829830038464.plus.aac.ep.m4a" },
    { "name": "Bonne nuit, ma chérie", "artist": "Wyn Hoop", "year": 1960, "image": "https://media.hitparade.ch/cover/800/wyn_hoop-bonne_nuit_ma_cherie_s.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/Music3/v4/0e/a9/24/0ea924cc-232b-4f2d-8190-59a78591ab48/mzaf_4602204757779649812.plus.aac.ep.m4a" },
    { "name": "Einmal sehen wir uns wieder", "artist": "Lale Andersen", "year": 1961, "image": "https://static.wikia.nocookie.net/eurosong-contest/images/5/5b/Einmalsehenwirunswieder.jpg/revision/latest?cb=20150822115826", "audio": "https://streamd.hitparade.ch/audio/0020000/0029585.mp3" },
    { "name": "Zwei kleine Italiener", "artist": "Conny Froboess", "year": 1962, "image": "https://m.media-amazon.com/images/I/41ySsHm9BqL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/13/f6/f5/13f6f5ca-ff64-ed26-ae85-71d032280816/mzaf_14448358994424798125.plus.aac.ep.m4a" },
    { "name": "Marcel", "artist": "Heidi Brühl", "year": 1963, "image": "https://media.hitparade.ch/cover/800/heidi_bruehl-marcel_s.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/51/08/a0/5108a066-cabc-b521-6035-521b10b935bf/mzaf_5017857922483489235.plus.aac.p.m4a" },
    { "name": "Man gewöhnt sich so schnell an das Schöne", "artist": "Nora Nova", "year": 1964, "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZSREcofEOvjAr8g7-jmPfCI-dAzt943b9vw&s", "audio": "https://streamd.hitparade.ch/audio/0020000/0029594.mp3" },
    { "name": "Paradies, wo bist du?", "artist": "Ulla Wiesner", "year": 1965, "image": "https://i.discogs.com/n5VMeEWr0xwKO-CRYuKIwCsO1kvVKcj9YLkMoAdmKQU/rs:fit/g:sm/q:90/h:600/w:597/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTUwNDQy/OTYtMTM4Mjk4MjE2/My03MzU2LmpwZWc.jpeg", "audio": "https://streamd.hitparade.ch/audio/0020000/0029608.mp3" },
    { "name": "Die Zeiger der Uhr", "artist": "Margot Eskens", "year": 1966, "image": "https://i.discogs.com/ryXm2FUmhJCml-Ondo7j07pAzDSghwmYaS_EFMg10ww/rs:fit/g:sm/q:40/h:300/w:300/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIwMTEz/OTctMTU4Nzk3NjA1/Ny04MTA2LmpwZWc.jpeg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/3a/77/ed/3a77ed96-645a-8e36-946c-fae1661282f8/mzaf_10607668618324774178.plus.aac.p.m4a" },
    { "name": "Anouschka", "artist": "Inge Brück", "year": 1967, "image": "https://media.hitparade.ch/cover/800/inge_brueck-anouschka_s.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/5f/c9/98/5fc9980f-3002-3726-055a-9eb4df382a3e/mzaf_7110411651553641022.plus.aac.p.m4a" },
    { "name": "Ein Hoch der Liebe", "artist": "Wencke Myhre", "year": 1968, "image": "https://static.wikia.nocookie.net/eurovisionsongcontests/images/0/06/EHDL.jpg/revision/latest/thumbnail/width/360/height/360?cb=20231213183105", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/4f/24/e8/4f24e816-6d8b-dfe4-3f49-ca9a9e120258/mzaf_7921167741376100218.plus.aac.ep.m4a" },
    { "name": "Primaballerina", "artist": "Siw Malmkvist", "year": 1969, "image": "https://upload.wikimedia.org/wikipedia/en/thumb/2/24/Primaballerina.jpg/250px-Primaballerina.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/b1/4b/c7/b14bc7df-b054-d254-d62c-6d821989b7f1/mzaf_12751021446645209675.plus.aac.ep.m4a" },
    { "name": "Wunder gibt es immer wieder", "artist": "Katja Ebstein", "year": 1970, "image": "https://e.snmc.io/i/1200/s/9074a22dcefbf234594bda3d53aa4167/3827139", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f5/f8/e2/f5f8e221-4e82-2847-c2cd-6647fccfa937/mzaf_6180106980538230077.plus.aac.ep.m4a" },
    { "name": "Diese Welt", "artist": "Katja Ebstein", "year": 1971, "image": "https://i.discogs.com/g8zQEPeeUZfXMnesoOIXBI_eyT7vhmOKtvQOM8-xL9Q/rs:fit/g:sm/q:90/h:598/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEwNTE0/NzAtMTY1Njk1MjUz/Mi0xOTIyLmpwZWc.jpeg", "audio": "https://streamd.hitparade.ch/audio/0020000/0029627.mp3" },
    { "name": "Nur die Liebe läßt uns leben", "artist": "Mary Roos", "year": 1972, "image": "https://i.scdn.co/image/ab67616d0000b2735e15db0a5b8ee7c19a8bd858", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/8c/0b/9c/8c0b9cd3-7fd4-92a6-47a0-e1a00dabaa3f/mzaf_1091836412250319961.plus.aac.ep.m4a" },
    { "name": "Junger Tag", "artist": "Gitte", "year": 1973, "image": "https://m.media-amazon.com/images/I/913Mz0VNUvL._UF894,1000_QL80_.jpg", "audio": "https://streamd.hitparade.ch/audio/0020000/0020349.mp3" },
    { "name": "Die Sommermelodie", "artist": "Cindy & Bert", "year": 1974, "image": "https://media.hitparade.ch/cover/800/cindy_bert-die_sommermelodie_s.jpg", "audio": "https://streamd.hitparade.ch/audio/0020000/0028128.mp3" },
    { "name": "Ein Lied kann eine Brücke sein", "artist": "Joy Fleming", "year": 1975, "image": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Ein_Lied_kann_eine_Br%C3%BCcke_sein.png/250px-Ein_Lied_kann_eine_Br%C3%BCcke_sein.png", "audio": "https://streamd.hitparade.ch/audio/0020000/0028129.mp3" },
    { "name": "Sing Sang Song", "artist": "Les Humphries Singers", "year": 1976, "image": "https://static.wikia.nocookie.net/eurosong-contest/images/c/c5/SingSangSong.jpg/revision/latest?cb=20150825112453", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f2/5b/b7/f25bb733-ecce-b06f-d824-0f1f856f12e2/mzaf_10657100690125580832.plus.aac.ep.m4a" },
    { "name": "Telegram", "artist": "Silver Convention", "year": 1977, "image": "https://m.media-amazon.com/images/I/51EO6i0Z5nL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/cd/60/74/cd607419-8a2f-b3e3-c4c6-304eb1e3de06/mzaf_4651839447707987866.plus.aac.ep.m4a" },
    { "name": "Feuer", "artist": "Ireen Sheer", "year": 1978, "image": "https://tovi-records.com/images/product_images/popup_images/ireen-sheer_feuer_800k.jpg", "audio": "https://streamd.hitparade.ch/audio/0020000/0020597.mp3" },
    { "name": "Dschingis Khan", "artist": "Dschingis Khan", "year": 1979, "image": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Self-titled_song_by_Dschinghis_Khan_German_vinyl_single.jpg/250px-Self-titled_song_by_Dschinghis_Khan_German_vinyl_single.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/76/16/91/76169159-f2ec-e8af-56dd-4128c4f6aae2/mzaf_6137288846546953841.plus.aac.ep.m4a" },
    { "name": "Theater", "artist": "Katja Ebstein", "year": 1980, "image": "https://m.media-amazon.com/images/I/61Mhzf6EOEL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/d7/97/07/d797072d-5363-3430-b292-4733e989b67b/mzaf_17956866133616702413.plus.aac.ep.m4a" },
    { "name": "Johnny Blue", "artist": "Lena Valaitis", "year": 1981, "image": "https://m.media-amazon.com/images/I/61+klTUTD5L._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/6d/41/f8/6d41f89d-6872-3dd3-7f08-18a8172b8449/mzaf_7982941314487419677.plus.aac.ep.m4a" },
    { "name": "Ein bißchen Frieden", "artist": "Nicole", "year": 1982, "image": "https://1265745076.rsc.cdn77.org/1024/jpg/35405-60991bce15ad3.jpg", "audio": "https://streamd.hitparade.ch/audio/0000000/0000833.mp3" },
    { "name": "Rücksicht", "artist": "Hoffmann & Hoffmann", "year": 1983, "image": "https://images.recordsale.de/600/600/hoffmann-hoffmann_ruecksicht_2.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/93/aa/ee/93aaee21-c7f2-0987-2b90-444eb5db357f/mzaf_9334676290285578594.plus.aac.ep.m4a" },
    { "name": "Aufrecht geh'n", "artist": "Mary Roos", "year": 1984, "image": "https://m.media-amazon.com/images/I/51NgRm9J2BL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/b7/d3/64/b7d364ad-e180-9fde-7d47-05477d969fd5/mzaf_10547608586774369204.plus.aac.ep.m4a" },
    { "name": "Für alle", "artist": "Wind", "year": 1985, "image": "https://media.hitparade.ch/cover/800/wind-fuer_alle_s.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/60/a5/06/60a506cd-690e-f452-4306-a52ea0573bb4/mzaf_17617275317659097123.plus.aac.ep.m4a" },
    { "name": "Über die Brücke geh'n", "artist": "Ingrid Peters", "year": 1986, "image": "https://1265745076.rsc.cdn77.org/1024/jpg/12000-5d2269f0a6cac.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f4/c4/a0/f4c4a03a-b04e-a991-d7f2-2f7521316c2f/mzaf_1337248187642543689.plus.aac.ep.m4a" },
    { "name": "Laß die Sonne in dein Herz", "artist": "Wind", "year": 1987, "image": "https://m.media-amazon.com/images/I/51PGBBYkuTL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/1b/86/8e/1b868e42-ffbc-21cf-ba95-05ff8cd9e366/mzaf_17016008813426721837.plus.aac.ep.m4a" },
    { "name": "Lied für einen Freund", "artist": "Maxi & Chris Garden", "year": 1988, "image": "https://m.media-amazon.com/images/I/518NJnUwx0L._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview124/v4/c5/15/3a/c5153a2d-035b-d286-798b-a07d2ca2a8d8/mzaf_1138114177324088573.plus.aac.ep.m4a" },
    { "name": "Flieger", "artist": "Nino de Angelo", "year": 1989, "image": "https://m.media-amazon.com/images/I/41-BGcTjmzL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/d7/1d/db/d71ddbd9-620e-1cf0-a7ba-a90777c9396e/mzaf_17728175064935516421.plus.aac.ep.m4a" },
    { "name": "Frei zu leben", "artist": "Chris Kempers & Daniel Kovac", "year": 1990, "image": "https://media.hitparade.ch/cover/800/chris_kempers_daniel_kovac-frei_zu_leben_s.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview114/v4/a3/43/42/a3434218-b322-b255-6699-c41ae4e0eea8/mzaf_13171721033009639995.plus.aac.ep.m4a" },
    { "name": "Dieser Traum darf niemals sterben", "artist": "Atlantis 2000", "year": 1991, "image": "https://static.wikia.nocookie.net/eurosong-contest/images/2/2e/DieserTraumdarfniemalssterben.jpg/revision/latest?cb=20150826205919", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9c/86/6f/9c866f3e-0638-a28c-95a1-e682b0e65394/mzaf_3172487265117160007.plus.aac.ep.m4a" },
    { "name": "Träume sind für alle da", "artist": "Wind", "year": 1992, "image": "https://media.hitparade.ch/cover/800/wind-traeume_sind_fuer_alle_da_s.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/33/ce/fc/33cefc44-d570-2b99-e126-2f97bb944dfc/mzaf_1956723851653892955.plus.aac.ep.m4a" },
    { "name": "Viel zu weit", "artist": "Münchener Freiheit", "year": 1993, "image": "https://e.snmc.io/i/1200/s/86393ef11ca9a50afaad5576eaee372d/1823480", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/08/20/fb/0820fb6d-67cc-0547-b9bb-e9adb3266d39/mzaf_18102666745877796328.plus.aac.ep.m4a" },
    { "name": "Wir geben 'ne Party", "artist": "Mekado", "year": 1994, "image": "https://images.genius.com/966871bbdfebd4ad9f63937e772e35c7.518x518x1.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/6e/d9/df/6ed9df40-1f13-ecae-86cf-5af8dff5f813/mzaf_7644510770387594016.plus.aac.ep.m4a" },
    { "name": "Verliebt in Dich", "artist": "Stone & Stone", "year": 1995, "image": "https://media.hitparade.ch/cover/800/stone_stone-verliebt_in_dich_s.jpg", "audio": "https://streamd.hitparade.ch/audio/0020000/0028363.mp3" },
    { "name": "Planet of Blue", "artist": "Leon", "year": 1996, "image": "https://m.media-amazon.com/images/I/51vFkQtubCL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/5c/e5/32/5ce532c4-e9fc-bed0-19ec-ee54ee63f4b4/mzaf_17339311345822252763.plus.aac.ep.m4a" },
    { "name": "Zeit", "artist": "Bianca Shomburg", "year": 1997, "image": "https://media.hitparade.ch/cover/800/bianca_shomburg-zeit_s.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7a/44/57/7a4457ff-00ef-c7e5-2c7a-8d8176f02a9c/mzaf_17821810964642130615.plus.aac.ep.m4a" },
    { "name": "Guildo hat euch lieb!", "artist": "Guildo Horn", "year": 1998, "image": "https://m.media-amazon.com/images/I/41yy7yW3KyL._UF894,1000_QL80_.jpg", "audio": "https://streamd.hitparade.ch/audio/0000000/0003676.mp3" },
    { "name": "Reise nach Jerusalem", "artist": "Sürpriz", "year": 1999, "image": "https://m.media-amazon.com/images/I/51+wKnKpL8L._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e8/7f/ac/e87facac-0c56-bfa8-9f09-b583f34ad61a/mzaf_13212245179092316152.plus.aac.ep.m4a" },
    { "name": "Wadde hadde dudde da?", "artist": "Stefan Raab", "year": 2000, "image": "https://m.media-amazon.com/images/I/51JmvkVncVL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/16/eb/49/16eb4918-4659-b330-6bc9-02bf35646377/mzaf_6928805244923223628.plus.aac.ep.m4a" },
    { "name": "Wer Liebe lebt", "artist": "Michelle", "year": 2001, "image": "https://m.media-amazon.com/images/I/51XlsR7E5lL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/5a/47/d7/5a47d7ef-0880-e80e-a0c1-ccc8a84b117e/mzaf_13437988486842010302.plus.aac.ep.m4a" },
    { "name": "I Can't Live Without Music", "artist": "Corinna May", "year": 2002, "image": "https://m.media-amazon.com/images/I/51EgDVM5znL._UF894,1000_QL80_.jpg", "audio": "https://streamd.hitparade.ch/audio/0020000/0020817.mp3" },
    { "name": "Let's Get Happy", "artist": "Lou", "year": 2003, "image": "https://m.media-amazon.com/images/I/51mB+DCKAjL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview114/v4/f4/ac/20/f4ac208e-b04d-34e1-750c-0ecf2325e227/mzaf_2660002242183906114.plus.aac.ep.m4a" },
    { "name": "Can't Wait Until Tonight", "artist": "Max Mutzke", "year": 2004, "image": "https://m.media-amazon.com/images/I/61o0pA6C4oL.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b6/7f/0b/b67f0b24-0184-86ea-14a9-1ebb4ce843b2/mzaf_10246742273506420373.plus.aac.ep.m4a" },
    { "name": "Run & Hide", "artist": "Gracia", "year": 2005, "image": "https://m.media-amazon.com/images/I/51MkV+h6rhL._UF894,1000_QL80_.jpg", "audio": "https://streamd.hitparade.ch/audio/0080000/0084511.mp3" },
    { "name": "No No Never", "artist": "Texas Lightning", "year": 2006, "image": "https://m.media-amazon.com/images/I/71KB2OEUfdL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/17/bf/af/17bfaf6d-47af-13d6-8762-12f35bf7e182/mzaf_6498999678460048187.plus.aac.ep.m4a" },
    { "name": "Frauen regier'n die Welt", "artist": "Roger Cicero", "year": 2007, "image": "https://m.media-amazon.com/images/I/51tiJHQ9RlL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/ed/b9/56/edb956b0-3328-afe1-4049-069bd1f26020/mzaf_9163416272258414792.plus.aac.ep.m4a" },
    { "name": "Disappear", "artist": "No Angels", "year": 2008, "image": "https://images.universal-music.de/img/assets/688/6884/4/1200/noangels-disappear-cover-300cmykjpg.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/de/a7/45/dea74577-e01b-fbd6-b510-be7633ceeb2f/mzaf_10490135433510421201.plus.aac.ep.m4a" },
    { "name": "Miss Kiss Kiss Bang", "artist": "Alex Swings Oscar Sings!", "year": 2009, "image": "https://m.media-amazon.com/images/I/41Sbc8YsudL._UF894,1000_QL80_.jpg", "audio": "https://streamd.hitparade.ch/audio/0550000/0556143.mp3" },
    { "name": "Satellite", "artist": "Lena", "year": 2010, "image": "https://i.discogs.com/JQK6RUhMuCRNgX5_nHio9xQxPBzO0lSKt1cdaMUjPx8/rs:fit/g:sm/q:40/h:300/w:300/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTcyOTE3/ODAtMTUxMjA4MDI4/MC01MzM5LmpwZWc.jpeg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/62/bb/78/62bb78c2-16e6-f68e-4b99-fcdf3ee5e596/mzaf_4821521866105654340.plus.aac.ep.m4a" },
    { "name": "Taken By A Stranger", "artist": "Lena", "year": 2011, "image": "https://m.media-amazon.com/images/I/41rxI-t8hWL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/97/6d/8f/976d8fb6-3e57-441b-d5fe-4cfc17838bdb/mzaf_7734009613846651833.plus.aac.ep.m4a" },
    { "name": "Standing Still", "artist": "Roman Lob", "year": 2012, "image": "https://m.media-amazon.com/images/I/81e9hcseE5L.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/48/72/69/4872697a-4d16-9a69-7844-c1d8e30cc4a3/mzaf_16427248183430133386.plus.aac.ep.m4a" },
    { "name": "Glorious", "artist": "Cascada", "year": 2013, "image": "https://m.media-amazon.com/images/I/615-PPsYO+L._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/69/89/15/69891574-28db-e847-c77f-f9d6254a2ffe/mzaf_10804754777296173548.plus.aac.ep.m4a" },
    { "name": "Is It Right", "artist": "Elaiza", "year": 2014, "image": "https://images.universal-music.de/img/assets/339/339535/195/is-it-right.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/12/c7/ac/12c7acd3-d022-b8b0-29d2-ac3513e6eb96/mzaf_14298127427142754832.plus.aac.ep.m4a" },
    { "name": "Black Smoke", "artist": "Ann Sophie", "year": 2015, "image": "https://images.universal-music.de/img/assets/362/362325/4/720/black-smoke.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/60/e8/77/60e87741-a5e4-f08e-2164-15b78991d70c/mzaf_17768745784540319170.plus.aac.ep.m4a" },
    { "name": "Ghost", "artist": "Jamie-Lee", "year": 2016, "image": "https://m.media-amazon.com/images/I/81gKHLg6rLL._AC_UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/c5/1c/52/c51c5270-5a56-2588-2dd5-52976137c36b/mzaf_4378607717724634761.plus.aac.ep.m4a" },
    { "name": "Perfect Life", "artist": "Levina", "year": 2017, "image": "https://m.media-amazon.com/images/I/716gkLgm0JL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/cb/31/5a/cb315a3e-fb4a-9cee-f067-c6a53ea57b4a/mzaf_12676650303185723067.plus.aac.ep.m4a" },
    { "name": "You Let Me Walk Alone", "artist": "Michael Schulte", "year": 2018, "image": "https://m.media-amazon.com/images/I/718FwmiozdL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/f2/a1/22/f2a122f6-c189-d078-8e57-a6e75551ffeb/mzaf_7735839449657758925.plus.aac.ep.m4a" },
    { "name": "Sister", "artist": "S!sters", "year": 2019, "image": "https://upload.wikimedia.org/wikipedia/en/f/fd/Sister_%28Sisters_song%29_cover.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/ad/fc/47/adfc47e1-22ae-d5ad-6599-0c5b49a899d0/mzaf_415524181296505926.plus.aac.ep.m4a" },
    { "name": "Violent Thing", "artist": "Ben Dolic", "year": 2020, "image": "https://cdn-images.dzcdn.net/images/cover/1dab6c3daeecc896d64145b60500eaea/1900x1900-000000-80-0-0.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/5d/09/7f/5d097f38-ec41-4372-13ef-66a183b5eb43/mzaf_1705895030742345495.plus.aac.ep.m4a" },
    { "name": "I Don't Feel Hate", "artist": "Jendrik", "year": 2021, "image": "https://i.scdn.co/image/ab67616d0000b27324e975be89df15475ce042dd", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/b4/61/9d/b4619d45-4a49-7031-0c6e-ff1ec158ff1f/mzaf_6833712252281933885.plus.aac.ep.m4a" },
    { "name": "Rockstars", "artist": "Malik Harris", "year": 2022, "image": "https://i.scdn.co/image/ab67616d0000b2734e8ae6088d5484e2a67c8bf9", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/f6/e1/34/f6e13445-8e33-482a-e937-2507e39ad040/mzaf_6813635848397489432.plus.aac.ep.m4a" },
    { "name": "Blood & Glitter", "artist": "Lord of the Lost", "year": 2023, "image": "https://m.media-amazon.com/images/I/91TcuhnfprL.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7b/2e/34/7b2e34a1-aba9-1f53-d47c-226a09f61e55/mzaf_12325837668306152270.plus.aac.ep.m4a" },
    { "name": "Always On The Run", "artist": "Isaak", "year": 2024, "image": "https://i.scdn.co/image/ab67616d0000b273a598c7307ed639bd1aba9fd9", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/05/4a/ac/054aac9f-8b18-8ee3-5d37-6152cf3dd1b0/mzaf_4050896113583734468.plus.aac.ep.m4a" },
    { "name": "Baller", "artist": "Abor & Tynna", "year": 2025, "image": "https://images.genius.com/155ece2aa75e09a8d129f94fa717c12c.1000x1000x1.png", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/68/18/f5/6818f555-3560-8ac8-38af-be9d636ea16e/mzaf_17457726171438638135.plus.aac.ep.m4a" }

];

const WINNER_CONTESTANTS: Contestant[] = [
  { "name": "Wasted Love", "artist": "JJ", "year": 2025, "image": "https://i.scdn.co/image/ab67616d0000b2737de5fab535418ab314d8f2d7", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/6a/5d/cb/6a5dcb50-cb81-9e3a-5b30-9db534cf2250/mzaf_11144356961687676260.plus.aac.ep.m4a" },
  { "name": "The Code", "artist": "Nemo", "year": 2024, "image": "https://m.media-amazon.com/images/I/31w4JVKju2L._UXNaN_FMjpg_QL85_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e1/fc/bb/e1fcbbdf-f2f6-af80-a476-65a07b48a653/mzaf_15771301684790254493.plus.aac.ep.m4a" },
  { "name": "Tattoo", "artist": "Loreen", "year": 2023, "image": "https://i.scdn.co/image/ab67616d0000b2732b0ba87db609976eee193bd6", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/5a/dd/6c/5add6cda-a867-6ed7-44f7-5f1fb84e2273/mzaf_12761850526582729829.plus.aac.ep.m4a" },
  { "name": "Stefania", "artist": "Kalush Orchestra", "year": 2022, "image": "https://m.media-amazon.com/images/I/81cmazNRrfL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/5d/49/39/5d493922-4c43-256f-2b2e-0211bb951be7/mzaf_16771858307219663041.plus.aac.ep.m4a" },
  { "name": "Zitti e buoni", "artist": "Måneskin", "year": 2021, "image": "https://cdn-images.dzcdn.net/images/cover/73ccbda9c7cf13e45cec4e8bf6cecd4f/0x1900-000000-80-0-0.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/83/5a/78/835a7827-3ad4-d12d-2921-204bae6f5c9e/mzaf_9324186145636776411.plus.aac.ep.m4a" },
  { "name": "Arcade", "artist": "Duncan Laurence", "year": 2019, "image": "https://cdn-images.dzcdn.net/images/cover/d6aa4d7fa64103b0532290af61a8fe67/1900x1900-000000-80-0-0.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/15/b3/cc/15b3ccaa-677f-28b5-3510-04061ed18182/mzaf_6658041100250268898.plus.aac.ep.m4a" },
  { "name": "Toy", "artist": "Netta", "year": 2018, "image": "https://i.scdn.co/image/ab67616d0000b273fc1e6aac4f02c6864d7a5f90", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/e3/a1/18/e3a118da-9f61-dc80-461f-20918caaea1b/mzaf_2028604709910015347.plus.aac.ep.m4a" },
  { "name": "Amar pelos dois", "artist": "Salvador Sobral", "year": 2017, "image": "https://m.media-amazon.com/images/I/51f8k4AlVZL._UXNaN_FMjpg_QL85_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/b1/22/7c/b1227c04-9a77-f09e-b76d-d718086f214e/mzaf_13693568115535938919.plus.aac.ep.m4a" },
  { "name": "1944", "artist": "Jamala", "year": 2016, "image": "https://m.media-amazon.com/images/I/419HP53treL._UXNaN_FMjpg_QL85_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/97/78/1d/97781de1-b864-771a-8928-fea43e6b2025/mzaf_16374615363200442881.plus.aac.ep.m4a" },
  { "name": "Heroes", "artist": "Måns Zelmerlöw", "year": 2015, "image": "https://media.hitparade.ch/cover/800/maans_zelmerloew-heroes_s.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f7/81/ff/f781ffc0-9de1-4e00-7b15-14c4c9830893/mzaf_13260917083681951307.plus.aac.ep.m4a" },
  { "name": "Rise Like a Phoenix", "artist": "Conchita Wurst", "year": 2014, "image": "https://i.scdn.co/image/ab67616d0000b27331fadd05a8e7ad1c2a2f9c61", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/88/93/1f/88931ff3-4ad3-5a82-172e-7f8f011b63f2/mzaf_15726431587997680356.plus.aac.ep.m4a" },
  { "name": "Only Teardrops", "artist": "Emmelie de Forest", "year": 2013, "image": "https://m.media-amazon.com/images/I/41+1sI19RGL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/04/e5/1f/04e51f7a-75cc-f6b1-bbaa-20116dbd26a7/mzaf_16231627003997458719.plus.aac.ep.m4a" },
  { "name": "Euphoria", "artist": "Loreen", "year": 2012, "image": "https://cdn-images.dzcdn.net/images/cover/a53f5533391cdebbdfd48e9d6cece985/0x1900-000000-80-0-0.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ff/f3/20/fff32034-87f7-f2fa-1679-7a907aab2168/mzaf_8942140623204449396.plus.aac.ep.m4a" },
  { "name": "Running Scared", "artist": "Ell & Nikki", "year": 2011, "image": "https://i.scdn.co/image/ab67616d0000b273003c233b90b790d7c4dda21c", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/6d/a4/68/6da468af-67c4-e36f-3e89-7b6af5503bca/mzaf_8515695012092340296.plus.aac.ep.m4a" },
  { "name": "Satellite", "artist": "Lena", "year": 2010, "image": "https://upload.wikimedia.org/wikipedia/en/4/42/Satelliteeuropeancover.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/62/bb/78/62bb78c2-16e6-f68e-4b99-fcdf3ee5e596/mzaf_4821521866105654340.plus.aac.ep.m4a" },
  { "name": "Fairytale", "artist": "Alexander Rybak", "year": 2009, "image": "https://i.scdn.co/image/ab67616d0000b2731f4dd0b239e64dec4154a467", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/3d/73/39/3d733935-9635-ad18-67f3-bdc79ee33ef3/mzaf_591558662604624355.plus.aac.ep.m4a" },
  { "name": "Believe", "artist": "Dima Bilan", "year": 2008, "image": "https://i.scdn.co/image/ab67616d0000b273e4d6136ac6dd3b786080a10f", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/21/76/1d/21761df7-0731-72e9-36d3-e3ef20b725e9/mzaf_3583625883043942948.plus.aac.ep.m4a" },
  { "name": "Molitva", "artist": "Marija Šerifović", "year": 2007, "image": "https://i.scdn.co/image/ab67616d0000b2732f77b1207a67c613913c9b9c", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/15/a0/12/15a012d3-b9f4-df91-d366-ce80677951c0/mzaf_7093614234828718976.plus.aac.ep.m4a" },
  { "name": "Hard Rock Hallelujah", "artist": "Lordi", "year": 2006, "image": "https://i.scdn.co/image/ab67616d0000b273b427a1bd44267a50dbe0a24f", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/c7/f8/b2/c7f8b299-abbc-80aa-49b1-813feb2442a6/mzaf_12251564392354923893.plus.aac.ep.m4a" },
  { "name": "My Number One", "artist": "Helena Paparizou", "year": 2005, "image": "https://m.media-amazon.com/images/I/51JnkqLjdkL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/ec/7b/68/ec7b6876-4670-dc82-89a2-b9817a376f43/mzaf_7398790623029424006.plus.aac.ep.m4a" },
  { "name": "Wild Dances", "artist": "Ruslana", "year": 2004, "image": "https://i.scdn.co/image/ab67616d0000b273f3310238d06afe3898fa0fdb", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/64/7e/b6/647eb6f8-eb02-c97d-41c8-4659560ab342/mzaf_18285765326735565314.plus.aac.ep.m4a" },
  { "name": "Everyway That I Can", "artist": "Sertab Erener", "year": 2003, "image": "https://m.media-amazon.com/images/I/51fV7LOZ6qL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/0b/aa/e6/0baae67a-dd62-09ef-603a-0601facc066b/mzaf_12829262217266249772.plus.aac.ep.m4a" },
  { "name": "I Wanna", "artist": "Marie N", "year": 2002, "image": "https://i.scdn.co/image/ab67616d0000b273382193f5e457873ea8421806", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f6/99/47/f6994711-2548-e3c8-cd65-dbd92e40c164/mzaf_13830281493428119251.plus.aac.ep.m4a" },
  { "name": "Everybody", "artist": "Tanel Padar & Dave Benton", "year": 2001, "image": "https://osta.img-bcg.eu/item/13/1916/101311916.jpg", "audio": "https://streamd.hitparade.ch/audio/0030000/0039404.mp3" },
  { "name": "Fly on the Wings of Love", "artist": "Olsen Brothers", "year": 2000, "image": "https://i.scdn.co/image/ab67616d0000b2736d965e893ab12cbc05ef7d81", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/db/4d/b8/db4db80a-b5e5-9658-4bf8-4326729d7b09/mzaf_6931662159270121094.plus.aac.ep.m4a" },
  { "name": "Take Me to Your Heaven", "artist": "Charlotte Nilsson", "year": 1999, "image": "https://i.scdn.co/image/ab67616d0000b273bff0488fa1726b023856513e", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/d3/f5/9c/d3f59c02-b3d5-6a4a-de82-19cf719c8d94/mzaf_312341167142909318.plus.aac.ep.m4a" },
  { "name": "Diva", "artist": "Dana International", "year": 1998, "image": "https://media.hitparade.ch/cover/800/dana_international-diva_s.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9a/55/c4/9a55c408-377d-17b9-544a-35bf5c68e62c/mzaf_5614694066295954355.plus.aac.ep.m4a" },
  { "name": "Love Shine a Light", "artist": "Katrina and the Waves", "year": 1997, "image": "https://m.media-amazon.com/images/I/71B7NT5x6XL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/7e/88/8b/7e888bb5-2f01-fe2a-2a34-bc558aa5face/mzaf_2139350226037017256.plus.aac.ep.m4a" },
  { "name": "The Voice", "artist": "Eimear Quinn", "year": 1996, "image": "https://i.scdn.co/image/ab67616d0000b27326806837a4631e1170ec0218", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/97/4a/4e/974a4ed6-1c8e-a53d-c97b-0d875cc200f7/mzaf_17489155732465181512.plus.aac.ep.m4a" },
  { "name": "Nocturne", "artist": "Secret Garden", "year": 1995, "image": "https://upload.wikimedia.org/wikipedia/en/1/14/Nocturne_%28Secret_Garden_song%29.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/7f/b0/72/7fb0722d-b6fb-9689-adfb-cb834d34063c/mzaf_2545893764777566415.plus.aac.ep.m4a" },
  { "name": "Rock 'n' Roll Kids", "artist": "Paul Harrington & Charlie McGettigan", "year": 1994, "image": "https://img.sheetmusic.direct/catalogue/product/smd_143249/large.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/53/b5/09/53b50970-ae6b-41e4-185c-fc076e0e3176/mzaf_6483659374376520574.plus.aac.ep.m4a" },
  { "name": "In Your Eyes", "artist": "Niamh Kavanagh", "year": 1993, "image": "https://m.media-amazon.com/images/I/51rAJN9UahL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/bc/c3/e6/bcc3e698-cfab-a4ad-3095-c202fb372fd3/mzaf_7366564195694655133.plus.aac.ep.m4a" },
  { "name": "Why Me?", "artist": "Linda Martin", "year": 1992, "image": "https://m.media-amazon.com/images/I/61T+FJPAyqL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/da/2d/98/da2d989a-5270-92f1-7a1b-d9aec86c1d8a/mzaf_9470766431368685818.plus.aac.ep.m4a" },
  { "name": "Fångad av en stormvind", "artist": "Carola", "year": 1991, "image": "https://upload.wikimedia.org/wikipedia/en/0/04/F%C3%A5ngad_av_en_stormvind.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/76/e4/c2/76e4c257-d053-5feb-c5b1-f8c74324280c/mzaf_13899735770710337976.plus.aac.ep.m4a" },
  { "name": "Insieme: 1992", "artist": "Toto Cutugno", "year": 1990, "image": "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Insieme_1992.jpg/250px-Insieme_1992.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/a3/77/e7/a377e7f6-316e-06c7-1167-c93db1d4b19c/mzaf_6361239865942788540.plus.aac.ep.m4a" },
  { "name": "Rock Me", "artist": "Riva", "year": 1989, "image": "https://m.media-amazon.com/images/I/51rTYyv6s0L._UXNaN_FMjpg_QL85_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/5e/20/42/5e20422e-12e7-78f9-5234-c3ea8f299895/mzaf_4189820922499163121.plus.aac.ep.m4a" },
  { "name": "Ne partez pas sans moi", "artist": "Céline Dion", "year": 1988, "image": "https://m.media-amazon.com/images/I/815Kg5hrZOL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/75/bd/ed/75bded3d-dcab-ebef-7f97-57b5db6546e7/mzaf_7943853906652688544.plus.aac.ep.m4a" },
  { "name": "Hold Me Now", "artist": "Johnny Logan", "year": 1987, "image": "https://m.media-amazon.com/images/I/51scld4ea8L._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/ab/41/83/ab4183d8-eeda-5b96-bc0b-e7ea05e16862/mzaf_11448974681307843136.plus.aac.ep.m4a" },
  { "name": "J'aime la vie", "artist": "Sandra Kim", "year": 1986, "image": "https://m.media-amazon.com/images/I/91bV+0lDPWL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e1/91/73/e19173f4-88c1-650b-92e6-49dee1e48874/mzaf_16316923288042957427.plus.aac.ep.m4a" },
  { "name": "La det swinge", "artist": "Bobbysocks!", "year": 1985, "image": "https://upload.wikimedia.org/wikipedia/en/9/9e/La_det_swinge.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/e4/49/45/e4494504-c919-19f1-3756-84e4e157c9c5/mzaf_5025945094122223094.plus.aac.ep.m4a" },
  { "name": "Diggi-Loo Diggi-Ley", "artist": "Herreys", "year": 1984, "image": "https://upload.wikimedia.org/wikipedia/en/a/a0/Herreys_-_Diggi-Loo_Diggi-Ley.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/57/5f/6d/575f6d8a-7725-9f48-3176-bc9dd3ecbdae/mzaf_124566953022816392.plus.aac.ep.m4a" },
  { "name": "Si la vie est cadeau", "artist": "Corinne Hermès", "year": 1983, "image": "https://m.media-amazon.com/images/I/91+XwY1xx8L._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/e0/4b/19/e04b19c6-9668-29f8-51e5-ca52a71e3b1d/mzaf_14557032103347549204.plus.aac.ep.m4a" },
  { "name": "Ein bißchen Frieden", "artist": "Nicole", "year": 1982, "image": "https://i.scdn.co/image/ab67616d0000b2736b8df8068d39d3d0198eca80", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/28/d4/b9/28d4b9bc-20bd-325a-8602-ce008cf417ea/mzaf_102254327236731367.plus.aac.ep.m4a" },
  { "name": "Making Your Mind Up", "artist": "Bucks Fizz", "year": 1981, "image": "https://m.media-amazon.com/images/I/61fzPmD3YxL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/40/3a/45/403a45f9-4e0a-e6da-28a9-409d9b7df975/mzaf_4049295194451206954.plus.aac.ep.m4a" },
  { "name": "What's Another Year", "artist": "Johnny Logan", "year": 1980, "image": "https://m.media-amazon.com/images/I/91QLWZDyuKL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/78/1d/50/781d50d4-6eff-037d-1c8f-76086f8ce80f/mzaf_1755393254029129903.plus.aac.ep.m4a" },
  { "name": "Hallelujah", "artist": "Gali Atari & Milk and Honey", "year": 1979, "image": "https://lastfm.freetls.fastly.net/i/u/500x500/946f116144e0fab93d83c375b96d2813.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/72/ac/9e/72ac9e03-3aa6-9c57-6ae8-7c6907e70e47/mzaf_12255271538612454228.plus.aac.ep.m4a" },
  { "name": "A-Ba-Ni-Bi", "artist": "Izhar Cohen & the Alphabeta", "year": 1978, "image": "https://i.ebayimg.com/images/g/iF0AAOSw7SRcwG0F/s-l400.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/6c/0e/46/6c0e46af-5957-8343-cf62-703311a623e8/mzaf_8185078206507471663.plus.aac.ep.m4a" },
  { "name": "L'oiseau et l'enfant", "artist": "Marie Myriam", "year": 1977, "image": "https://m.media-amazon.com/images/I/81VD3BjJ4CL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/fe/2d/cf/fe2dcf97-a8e0-1b17-fa3e-a869d3e7879c/mzaf_6063071287050692274.plus.aac.ep.m4a" },
  { "name": "Save Your Kisses for Me", "artist": "Brotherhood of Man", "year": 1976, "image": "https://upload.wikimedia.org/wikipedia/en/8/82/UK1976Congratulations.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/5d/ba/31/5dba3190-2d0c-9fbc-1709-9b23f32dd873/mzaf_16486452366378966260.plus.aac.ep.m4a" },
  { "name": "Ding-a-dong", "artist": "Teach-In", "year": 1975, "image": "https://i.scdn.co/image/ab67616d0000b273a9d52907bc7581d052b74131", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/66/89/0c/66890cd0-270b-3b07-b7dd-5078dd3b399f/mzaf_6719169335503150168.plus.aac.p.m4a" },
  { "name": "Waterloo", "artist": "ABBA", "year": 1974, "image": "https://m.media-amazon.com/images/I/61Mba2R4T0L._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f0/15/ee/f015ee0c-e661-ec0a-2d6c-aa1f8f4ad1e4/mzaf_15452140459757540488.plus.aac.ep.m4a" },
  { "name": "Tu te reconnaîtras", "artist": "Anne-Marie David", "year": 1973, "image": "https://a2.cdn.hhv.de/items/images/generated/970x970/01310/1310210/1-anne-marie-david-tu-te-reconnaitras.webp", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/76/0b/9a/760b9a39-d54e-0fea-81cb-51ba0b5e4669/mzaf_11398604948242695741.plus.aac.ep.m4a" },
  { "name": "Après toi", "artist": "Vicky Leandros", "year": 1972, "image": "https://media.senscritique.com/media/000007971187/0/Apres_toi_Single.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/53/92/4a/53924aa3-55a4-d0ae-688d-53e018e8de63/mzaf_7185463295298771273.plus.aac.ep.m4a" },
  { "name": "Un banc, un arbre, une rue", "artist": "Séverine", "year": 1971, "image": "https://m.media-amazon.com/images/I/717iuvd+VUS._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/be/b5/4b/beb54b1f-9121-f207-1266-14bb2df33692/mzaf_4629469241160081187.plus.aac.ep.m4a" },
  { "name": "All Kinds of Everything", "artist": "Dana", "year": 1970, "image": "https://m.media-amazon.com/images/I/91rPHa2erhL._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/5b/ef/fa/5beffac5-308b-ecc6-361c-5e7d3c8dc2c2/mzaf_10598707209114893805.plus.aac.ep.m4a" },
  { "name": "Vivo cantando", "artist": "Salomé", "year": 1969, "image": "https://upload.wikimedia.org/wikipedia/en/b/b5/Salom%C3%A9_-_Vivo_cantando.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/07/07/c9/0707c9c9-b4df-e1e2-210e-17f11683e909/mzaf_8507533122816221187.plus.aac.p.m4a" },
  { "name": "Boom Bang-a-Bang", "artist": "Lulu", "year": 1969, "image": "https://media.hitparade.ch/cover/800/lulu-boom_bang-a-bang_s.jpg", "audio": "https://streamd.hitparade.ch/audio/0000000/0000086.mp3" },
  { "name": "De troubadour", "artist": "Lenny Kuhr", "year": 1969, "image": "https://images.genius.com/820a3f939930759c2306aad3e0ad22e5.404x404x1.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/6b/d9/ea/6bd9ea05-b95e-2e8d-03fc-4b1d8aaaa786/mzaf_2217708826779175710.plus.aac.ep.m4a" },
  { "name": "Un jour, un enfant", "artist": "Frida Boccara", "year": 1969, "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMCnH6Sn1qefalZmDFxnzKYQ1Cteijf9d55A&s", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/78/2f/85/782f85a5-f2ec-a47f-1614-03b519b370bb/mzaf_13815748970036547790.plus.aac.ep.m4a" },
  { "name": "La, la, la", "artist": "Massiel", "year": 1968, "image": "https://upload.wikimedia.org/wikipedia/en/1/1a/Massiel_La%2C_la%2C_la.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/79/9b/86/799b86fc-7cab-0a77-7730-3ed0e14bfdb9/mzaf_4961109211463438386.plus.aac.ep.m4a" },
  { "name": "Puppet on a String", "artist": "Sandie Shaw", "year": 1967, "image": "https://m.media-amazon.com/images/I/A17kRCGgbML._UF894,1000_QL80_.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/4b/74/8e/4b748ec3-a7cb-552b-bb84-0334844947df/mzaf_1730430191195773384.plus.aac.p.m4a" },
  { "name": "Merci, Chérie", "artist": "Udo Jürgens", "year": 1966, "image": "https://upload.wikimedia.org/wikipedia/en/0/0e/Udo_J%C3%BCrgens_-_Merci%2C_Ch%C3%A9rie.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/d6/f4/c2/d6f4c22c-412d-bc23-9015-7979a3431b7a/mzaf_9504934551000525467.plus.aac.ep.m4a" },
  { "name": "Poupée de cire, poupée de son", "artist": "France Gall", "year": 1965, "image": "https://i.scdn.co/image/ab67616d0000b27357a0406e956dec2176a3e083", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/45/6f/d5/456fd52d-37dd-1395-541c-f00bc7f42847/mzaf_15113609904231100025.plus.aac.p.m4a" },
  { "name": "Non ho l'età", "artist": "Gigliola Cinquetti", "year": 1964, "image": "https://m.media-amazon.com/images/I/71FOB4c14tL.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/0e/18/14/0e181439-d600-24ba-7bbc-063dc28dd8ce/mzaf_8953823765284930874.plus.aac.ep.m4a" },
  { "name": "Dansevise", "artist": "Grethe & Jørgen Ingmann", "year": 1963, "image": "https://1265745076.rsc.cdn77.org/1024/jpg/12071-5d2480fd8c035.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/ac/c7/72/acc772e7-1714-68d7-47f2-aba253365a8f/mzaf_17016121520977863086.plus.aac.ep.m4a" },
  { "name": "Un premier amour", "artist": "Isabelle Aubret", "year": 1962, "image": "https://e.snmc.io/i/1200/s/e1337c601544ddf12510f3ca0007b73a/4354604", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/01/0f/f4/010ff4ac-6adf-1607-980a-097245f60d05/mzaf_11302056090786091262.plus.aac.ep.m4a" },
  { "name": "Nous les amoureux", "artist": "Jean-Claude Pascal", "year": 1961, "image": "https://is1-ssl.mzstatic.com/image/thumb/Music/a3/c7/db/mzi.qccntiba.tif/600x600bf-60.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/fd/87/e3/fd87e36f-8281-58e3-c5bd-bc6123517329/mzaf_16987694766764604608.plus.aac.ep.m4a" },
  { "name": "Tom Pillibi", "artist": "Jacqueline Boyer", "year": 1960, "image": "https://upload.wikimedia.org/wikipedia/en/d/d0/Jacqueline_Boyer_-_Tom_Pilibi.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/ce/14/05/ce1405ae-e70a-956b-b5fb-8e511e2ab00b/mzaf_8041646280111609568.plus.aac.ep.m4a" },
  { "name": "Een beetje", "artist": "Teddy Scholten", "year": 1959, "image": "https://upload.wikimedia.org/wikipedia/en/5/5b/Teddy_Scholten_-_Een_beetje.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/b4/7e/71/b47e71f3-900a-ac02-c858-094525a38ceb/mzaf_15602010966030889674.plus.aac.ep.m4a" },
  { "name": "Dors, mon amour", "artist": "André Claveau", "year": 1958, "image": "https://media.hitparade.ch/cover/800/andre_claveau-dors_mon_amour_s.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/ef/f8/98/eff89867-a7b0-70c4-05bc-b611b27e52a0/mzaf_6987564730995032524.plus.aac.ep.m4a" },
  { "name": "Net als toen", "artist": "Corry Brokken", "year": 1957, "image": "https://i.scdn.co/image/ab67616d0000b27359b63a1c95e60b656736ee92", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/aa/2f/46/aa2f46ee-bb91-48a8-eaad-205db373ec49/mzaf_1212237312242009249.plus.aac.ep.m4a" },
  { "name": "Refrain", "artist": "Lys Assia", "year": 1956, "image": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgvjMH-J6hkOgfqqNKEsFBJCbc3wrlx_vzd6pdUdGbcRJbOxpXoqYo3zqIzZdemT1BhLkXxJYWQQTQ-ZA5XgZ0kMguTGrKq_MHtFyimts7fUTwwARfg-lPwtqtMYH2ugszIMJTr/s1600/scannen0001.jpg", "audio": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/e4/3b/96/e43b9634-b519-8cfb-adea-401e079a035e/mzaf_1171133031111170120.plus.aac.ep.m4a" }
];

const step = ref('intro')
const rankMode = ref<'germany' | 'winners'>('germany') // THE NEW SWITCH
const minYear = ref(1956)
const maxYear = ref(2025)
const activePool = ref<Contestant[]>([])
const queue = ref<Contestant[][]>([])
const history = ref<{q: Contestant[][], m: Contestant[]}[]>([])
const mergedSoFar = ref<Contestant[]>([])
const currentSelection = ref<number | null>(null)
const isAudioPlaying = ref(false)
const audioPlayer = new Audio()

const zIndexMin = ref(5)
const zIndexMax = ref(5)

watch(minYear, (val) => {
  if (val > (maxYear.value - 5)) zIndexMin.value = 10;
  else zIndexMin.value = 5;
})

const battleOptions = computed(() => {
  const first = queue.value?.[0]?.[0]
  const second = queue.value?.[1]?.[0]
  if (first && second) return [first, second]
  return []
})

const progress = computed(() => {
  if (!activePool.value.length || step.value !== 'battle') return 0;
  const totalSteps = activePool.value.length - 1;
  const currentStep = activePool.value.length - queue.value.length;
  return Math.max(0, Math.min((currentStep / totalSteps) * 100, 99));
})

const startRanking = () => {
  const start = Math.min(minYear.value, maxYear.value)
  const end = Math.max(minYear.value, maxYear.value)
  
  // Decide which list to use based on the switch
  const sourceList = rankMode.value === 'germany' ? GERMAN_CONTESTANTS : WINNER_CONTESTANTS;
  
  activePool.value = sourceList.filter(c => c.year >= start && c.year <= end)
  if (activePool.value.length < 2) return alert("Wähle einen größeren Zeitraum oder Modus mit mehr Songs!")
  
  activePool.value.sort(() => Math.random() - 0.5)
  queue.value = activePool.value.map(c => [c])
  step.value = 'battle'
}

const selectOption = (idx: number) => {
  const song = battleOptions.value[idx]
  if (!song) return
  
  if (currentSelection.value === idx && isAudioPlaying.value) {
    audioPlayer.pause(); isAudioPlaying.value = false;
  } else {
    currentSelection.value = idx; audioPlayer.src = song.audio; audioPlayer.play(); isAudioPlaying.value = true;
  }
}

const confirmChoice = () => {
  if (currentSelection.value === null || queue.value.length < 2) return
  
  history.value.push({ 
    q: JSON.parse(JSON.stringify(queue.value)), 
    m: JSON.parse(JSON.stringify(mergedSoFar.value)) 
  })
  
  const leftSide = queue.value[0]
  const rightSide = queue.value[1]
  
  if (!leftSide || !rightSide) return

  if (currentSelection.value === 0) {
    const picked = leftSide.shift()
    if (picked) mergedSoFar.value.push(picked)
  } else {
    const picked = rightSide.shift()
    if (picked) mergedSoFar.value.push(picked)
  }

  if (leftSide.length === 0 || rightSide.length === 0) {
    queue.value.splice(0, 2); 
    queue.value.push([...mergedSoFar.value, ...leftSide, ...rightSide]); 
    mergedSoFar.value = []
  }
  
  audioPlayer.pause(); 
  isAudioPlaying.value = false; 
  currentSelection.value = null;
  
  if (queue.value.length <= 1) step.value = 'results'
}

const undo = () => {
  const last = history.value.pop()
  if (last) { 
    queue.value = last.q; 
    mergedSoFar.value = last.m; 
    currentSelection.value = null; 
    audioPlayer.pause(); 
    isAudioPlaying.value = false; 
  }
}
</script>

<template>
  <div class="esc-container">
    <div v-if="step === 'intro'" class="setup-card">
      <h1>ESC Ranker</h1>

      <div class="mode-switch">
        <button 
          :class="{ active: rankMode === 'germany' }" 
          @click="rankMode = 'germany'"
        >Deutsche Kandidaten</button>
        <button 
          :class="{ active: rankMode === 'winners' }" 
          @click="rankMode = 'winners'"
        >Gewinner</button>
      </div>
      
      <div class="range-controls">
        <div class="year-display">{{ Math.min(minYear, maxYear) }} — {{ Math.max(minYear, maxYear) }}</div>
        <div class="sliders-container">
          <div class="slider-track"></div>
          <input type="range" v-model.number="minYear" min="1956" max="2025" class="range-input" :style="{ zIndex: zIndexMin }" />
          <input type="range" v-model.number="maxYear" min="1956" max="2025" class="range-input" :style="{ zIndex: zIndexMax }" />
        </div>
      </div>
      <button class="btn-primary" @click="startRanking">Start Ranking</button>
    </div>

    <div v-if="step === 'battle'" class="battle-view">
      <div class="progress-bar"><div class="fill" :style="{ width: progress + '%' }"></div></div>
      <div class="battle-grid">
        <div v-for="(song, idx) in battleOptions" :key="song?.name ?? idx" class="song-card" @click="selectOption(idx)">
          <div class="image-wrapper" :class="{ selected: currentSelection === idx, 'not-selected': currentSelection !== null && currentSelection !== idx }">
            <img :src="song?.image ?? ''" :alt="song?.name ?? ''" />
            <div class="play-overlay">
              <span class="icon" :class="{ 'pause-active': isAudioPlaying && currentSelection === idx }">
                {{ isAudioPlaying && currentSelection === idx ? '❙❙' : '▶' }}
              </span>
            </div>
          </div>
          <div class="song-info">
            <h3>{{ song?.name ?? 'Unknown' }}</h3>
            <p>{{ song?.artist ?? 'Unknown' }} ({{ song?.year ?? '' }})</p>
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="btn-secondary" :disabled="history.length === 0" @click="undo">Undo</button>
        <button class="btn-primary" :disabled="currentSelection === null" @click="confirmChoice">Auswählen</button>
      </div>
    </div>

    <div v-if="step === 'results'" class="results-view">
      <h1>Dein Ranking</h1>
      <div class="results-simple-list">
        <div v-for="(song, index) in (queue[0] ?? [])" :key="song?.name ?? index" class="simple-item">
          <span class="rank-num">{{ index + 1 }}</span>
          <div class="song-details">
            <span class="name">{{ song?.name ?? '' }}</span>
            <span class="meta">{{ song?.artist ?? '' }} ({{ song?.year ?? '' }})</span>
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="btn-primary" @click="step = 'intro'">Neu Starten</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* INSERTING NEW SWITCH STYLES */
.mode-switch {
  display: flex;
  background: #111;
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 1px solid #333;
}
.mode-switch button {
  flex: 1;
  padding: 0.6rem 1.2rem;
  border: none;
  background: none;
  color: #888;
  font-family: var(--font-header);
  font-weight: 700;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
}
.mode-switch button.active {
  background: var(--brand-green);
  color: #000;
}

/* KEEPING ALL YOUR ORIGINAL STYLES BELOW */
.esc-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  margin-top: -80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 5vh; 
}
:deep(.header-spacer) { display: none; }
.setup-card { width: 100%; max-width: 600px; background: #1a1a1a; padding: 3rem 2rem; border-radius: 32px; border: 1px solid #333; text-align: center; }
h1 { font-family: var(--font-header); color: var(--brand-green); text-transform: uppercase; text-align: center; margin-bottom: 1.5rem; font-weight: 900; }
.range-controls { margin: 2rem 0; width: 100%; display: flex; flex-direction: column; align-items: center; }
.year-display { font-family: var(--font-header); font-size: 2.2rem; color: #fff; margin-bottom: 1.5rem; }
.sliders-container { position: relative; width: 100%; max-width: 500px; height: 40px; display: flex; align-items: center; }
.slider-track { position: absolute; height: 6px; width: 100%; background: #222; border-radius: 10px; z-index: 1; }
.range-input { position: absolute; width: 100%; pointer-events: none; appearance: none; -webkit-appearance: none; background: none; outline: none; margin: 0; }
.range-input::-webkit-slider-thumb { pointer-events: auto; appearance: none; width: 28px; height: 28px; border-radius: 50%; background: var(--brand-green); cursor: pointer; border: 3px solid #fff; box-shadow: 0 0 10px rgba(0,0,0,0.5); position: relative; z-index: 2; }
.range-input::-moz-range-thumb { pointer-events: auto; width: 28px; height: 28px; border-radius: 50%; background: var(--brand-green); cursor: pointer; border: 3px solid #fff; z-index: 2; }
.battle-grid { display: grid; grid-template-columns: minmax(150px, 360px) 80px minmax(150px, 360px); justify-content: center; align-items: flex-start; margin-top: 1rem; gap: 1rem; }
.battle-grid::after { content: 'VS'; grid-column: 2; grid-row: 1; align-self: center; font-family: var(--font-header); font-weight: 900; font-size: 2.5rem; color: #222; text-align: center; }
.song-card { background: transparent; cursor: pointer; text-align: center; width: 100%; }
.image-wrapper { width: 100%; aspect-ratio: 1; position: relative; border-radius: 24px; overflow: hidden; border: 4px solid transparent; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); background: #000; }
.image-wrapper img { width: 100%; height: 100%; object-fit: cover; opacity: 0.9; filter: saturate(0.4) brightness(0.6); transition: filter 0.4s ease, opacity 0.4s ease; }
.song-card:hover .image-wrapper img, .image-wrapper.selected img { filter: saturate(1) brightness(1); opacity: 1; }
.image-wrapper.selected { border-color: var(--brand-green); box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4); }
.image-wrapper.not-selected img { filter: saturate(0.5) brightness(0.8); opacity: 0.5; }
.play-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.2); opacity: 0; transition: 0.2s; z-index: 2;}
.song-card:hover .play-overlay { opacity: 1; }
.icon { font-size: 5rem; color: #fff; filter: drop-shadow(0 0 10px rgba(0,0,0,0.5)); }
.pause-active { font-weight: bold; letter-spacing: -2px; }
.song-info { padding: 1rem 0; min-height: 80px; transition: opacity 0.4s ease;}
.image-wrapper.not-selected + .song-info { opacity: 0.5; }
.song-info h3 { font-family: var(--font-header); font-size: 1.2rem; color: #fff; margin-bottom: 0.2rem; }
.song-info p { color: var(--brand-green); font-size: 0.9rem; margin: 0;}
.actions { display: flex; justify-content: center; gap: 1.5rem; margin-top: 1rem; }
.progress-bar { width: 100%; height: 6px; background: #222; border-radius: 10px; margin-bottom: 2rem; overflow: hidden;}
.progress-bar .fill { height: 100%; background: var(--brand-green); transition: width 0.4s ease;}
.results-simple-list { background: #161616; border-radius: 16px; padding: 1rem; border: 1px solid #222; margin-bottom: 2rem; }
.simple-item { display: flex; align-items: center; padding: 0.8rem 1rem; border-bottom: 1px solid #222; gap: 1rem; }
.simple-item:last-child { border: none; }
.rank-num { font-family: var(--font-header); color: var(--brand-green); font-weight: 900; font-size: 1.1rem; width: 25px; }
.song-details { display: flex; flex-direction: column; }
.song-details .name { font-weight: 700; color: #fff; font-size: 1rem; }
.song-details .meta { font-size: 0.85rem; color: #888; }

@media (max-width: 768px) {
  .esc-container { padding-top: 20px; }
  .battle-grid { grid-template-columns: 1fr 40px 1fr; gap: 0.5rem; }
  .battle-grid::after { font-size: 1.2rem; }
  .image-wrapper { border-radius: 12px; border-width: 2px; }
  .song-info h3 { font-size: 0.9rem; line-height: 1.2; }
  .song-info p { font-size: 0.75rem; }
  .icon { font-size: 2.5rem; }
  .actions { flex-direction: row; gap: 0.8rem; }
  .btn-primary, .btn-secondary { padding: 0.6rem 1rem; font-size: 0.9rem; }
}
</style>