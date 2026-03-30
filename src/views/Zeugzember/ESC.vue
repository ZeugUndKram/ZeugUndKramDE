<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Contestant {
  name: string;
  artist: string;
  year: number;
  image: string;
  audio: string;
}

const ALL_CONTESTANTS: Contestant[] = [
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

const step = ref('intro')
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

// Fix for 'Object possibly undefined' by checking length explicitly
const battleOptions = computed(() => {
  if (queue.value.length >= 2 && queue.value[0].length > 0 && queue.value[1].length > 0) {
    return [queue.value[0][0], queue.value[1][0]]
  }
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
  activePool.value = ALL_CONTESTANTS.filter(c => c.year >= start && c.year <= end)
  if (activePool.value.length < 2) return alert("Wähle einen größeren Zeitraum!")
  activePool.value.sort(() => Math.random() - 0.5)
  queue.value = activePool.value.map(c => [c])
  step.value = 'battle'
}

const selectOption = (idx: number) => {
  const song = battleOptions.value[idx]
  if (!song) return; // Defensive check for TS
  
  if (currentSelection.value === idx && isAudioPlaying.value) {
    audioPlayer.pause(); isAudioPlaying.value = false;
  } else {
    currentSelection.value = idx; audioPlayer.src = song.audio; audioPlayer.play(); isAudioPlaying.value = true;
  }
}

const confirmChoice = () => {
  if (currentSelection.value === null || queue.value.length < 2) return
  
  history.value.push({ q: JSON.parse(JSON.stringify(queue.value)), m: JSON.parse(JSON.stringify(mergedSoFar.value)) })
  
  // Use ! (non-null assertion) because we know these exist from the check above
  let L = queue.value[0]! 
  let R = queue.value[1]!
  
  if (currentSelection.value === 0) mergedSoFar.value.push(L.shift()!) 
  else mergedSoFar.value.push(R.shift()!)

  if (L.length === 0 || R.length === 0) {
    queue.value.splice(0, 2); 
    // Add the remaining items from the other side
    queue.value.push([...mergedSoFar.value, ...L, ...R]); 
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

// Result list safe check
const finalResults = computed(() => {
  return (queue.value.length > 0) ? queue.value[0] : []
})
</script>

<template>
  <div class="esc-container">
    <div v-if="step === 'intro'" class="setup-card">
      <h1>Germany ESC Ranker</h1>
      <p>Wähle deine Ära und finde deinen Favoriten.</p>
      
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
        <div v-for="(song, idx) in battleOptions" :key="song.name" class="song-card" @click="selectOption(idx)">
          <div 
            class="image-wrapper" 
            :class="{ 
              selected: currentSelection === idx,
              'not-selected': currentSelection !== null && currentSelection !== idx 
            }"
          >
            <img :src="song.image" :alt="song.name" />
            <div class="play-overlay">
              <span class="icon" :class="{ 'pause-active': isAudioPlaying && currentSelection === idx }">
                {{ isAudioPlaying && currentSelection === idx ? '❙❙' : '▶' }}
              </span>
            </div>
          </div>
          <div class="song-info">
            <h3>{{ song.name }}</h3>
            <p>{{ song.artist }} ({{ song.year }})</p>
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
        <div v-for="(song, index) in finalResults" :key="song.name" class="simple-item">
          <span class="rank-num">{{ index + 1 }}</span>
          <div class="song-details">
            <span class="name">{{ song.name }}</span>
            <span class="meta">{{ song.artist }} ({{ song.year }})</span>
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
.esc-container { max-width: 1100px; margin: 0 auto; padding: 40px 1rem 5rem; min-height: 100vh; }
h1 { font-family: var(--font-header); color: var(--brand-green); text-transform: uppercase; text-align: center; margin-bottom: 1.5rem; font-weight: 900; }

/* SLIDER */
.range-controls { margin: 2rem 0; width: 100%; display: flex; flex-direction: column; align-items: center; }
.year-display { font-family: var(--font-header); font-size: 2.2rem; color: #fff; margin-bottom: 1.5rem; }
.sliders-container { position: relative; width: 100%; max-width: 500px; height: 40px; display: flex; align-items: center; }
.slider-track { position: absolute; height: 6px; width: 100%; background: #222; border-radius: 10px; z-index: 1; }
.range-input { position: absolute; width: 100%; pointer-events: none; appearance: none; -webkit-appearance: none; background: none; outline: none; margin: 0; }
.range-input::-webkit-slider-thumb { pointer-events: auto; appearance: none; width: 28px; height: 28px; border-radius: 50%; background: var(--brand-green); cursor: pointer; border: 3px solid #fff; box-shadow: 0 0 10px rgba(0,0,0,0.5); position: relative; z-index: 2; }
.range-input::-moz-range-thumb { pointer-events: auto; width: 28px; height: 28px; border-radius: 50%; background: var(--brand-green); cursor: pointer; border: 3px solid #fff; z-index: 2; }

/* BATTLE GRID */
.battle-grid { 
  display: grid; 
  grid-template-columns: minmax(150px, 360px) 80px minmax(150px, 360px);
  justify-content: center; 
  align-items: flex-start; 
  margin-top: 1rem; 
  gap: 1rem; 
}
.battle-grid::after { content: 'VS'; grid-column: 2; grid-row: 1; align-self: center; font-family: var(--font-header); font-weight: 900; font-size: 2.5rem; color: #222; text-align: center; }

.song-card { background: transparent; cursor: pointer; text-align: center; width: 100%; }

/* IMAGE WRAPPER FILTERS */
.image-wrapper { 
  width: 100%; 
  aspect-ratio: 1; 
  position: relative; 
  border-radius: 24px; 
  overflow: hidden; 
  border: 4px solid transparent; 
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
  background: #000; 
}

.image-wrapper img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
  opacity: 0.9;
  filter: saturate(0.4) brightness(0.6); /* Default state: Dark and desaturated */
  transition: filter 0.4s ease, opacity 0.4s ease;
}

/* Hover or Selected: Full color and brightness */
.song-card:hover .image-wrapper img,
.image-wrapper.selected img { 
  filter: saturate(1) brightness(1); 
  opacity: 1;
}

.image-wrapper.selected { 
  border-color: var(--brand-green); 
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4); 
}

/* Not selected (when the OTHER one is selected): Extra dark/grey */
.image-wrapper.not-selected img {
  filter: saturate(0.5) brightness(0.8);
  opacity: 0.5;
}

.play-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.2); opacity: 0; transition: 0.2s; z-index: 2;}
.song-card:hover .play-overlay { opacity: 1; }
.icon { font-size: 5rem; color: #fff; filter: drop-shadow(0 0 10px rgba(0,0,0,0.5)); }
.pause-active { font-weight: bold; letter-spacing: -2px; }

.song-info { padding: 1rem 0; min-height: 80px; transition: opacity 0.4s ease;}
.image-wrapper.not-selected + .song-info { opacity: 0.5; } /* Fade text for the unselected one too */

.song-info h3 { font-family: var(--font-header); font-size: 1.2rem; color: #fff; margin-bottom: 0.2rem; }
.song-info p { color: var(--brand-green); font-size: 0.9rem; margin: 0;}

.actions { display: flex; justify-content: center; gap: 1.5rem; margin-top: 1rem; }

/* PROGRESS */
.progress-bar { width: 100%; height: 6px; background: #222; border-radius: 10px; margin-bottom: 2rem; overflow: hidden;}
.progress-bar .fill { height: 100%; background: var(--brand-green); transition: width 0.4s ease;}

/* RESULTS */
.results-simple-list { background: #161616; border-radius: 16px; padding: 1rem; border: 1px solid #222; margin-bottom: 2rem; }
.simple-item { display: flex; align-items: center; padding: 0.8rem 1rem; border-bottom: 1px solid #222; gap: 1rem; }
.simple-item:last-child { border: none; }
.rank-num { font-family: var(--font-header); color: var(--brand-green); font-weight: 900; font-size: 1.1rem; width: 25px; }
.song-details { display: flex; flex-direction: column; }
.song-details .name { font-weight: 700; color: #fff; font-size: 1rem; }
.song-details .meta { font-size: 0.85rem; color: #888; }

.setup-card { background: #1a1a1a; padding: 3rem 2rem; border-radius: 32px; border: 1px solid #333; text-align: center; }

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