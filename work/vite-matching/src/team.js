// Public Refield team; supplied portraits follow the source order.
const people = [
 ['Fabian Eryk','Barbarowicz','Wspólnik zarządzający','fabian'],
 ['Mateusz','Świętochowski','Dyrektor operacyjny','mateusz'],
 ['Marek','Barbarowicz','Inwestor zastępczy','marek.barbarowicz'],
 ['Marta','Tyszko','Radca prawny','marta.tyszko'],
 ['Marta','Foltyn','Adwokat','marta.foltyn'],
 ['Roland','Kaczmarek','Menedżer ds. komercjalizacji','roland.kaczmarek'],
 ['Agnieszka','Januszko','Menedżer ds. komercjalizacji','agnieszka.januszko'],
 ['Angelika','Grabiec','Kierownik projektu','angelika.grabiec'],
 ['Krystian','Psut','Kierownik projektu','krystian.psut'],
 ['Marcin','Jarawka','Menedżer ds. rozwoju','marcin.jarawka'],
 ['Kinga','Sierocińska','Kontroler finansowy','kinga.sierocinska'],
 ['Gabriela','Zawadka','Specjalista ds. inwestycji','gabriela.zawadka'],
 ['Aleksandra','Małecka','Specjalista ds. administracji','aleksandra.malecka']
];
document.querySelector('#team-grid').innerHTML = people.map(([first,last,role,email],i)=>`
 <article class="team-person">
  <div class="team-portrait"><img src="/assets/refield-team-${i+1}.webp" alt="${first} ${last}" loading="lazy" width="500" height="500"></div>
  <div class="team-caption"><div class="team-caption-body"><h3>${first} ${last}</h3><span class="team-role" title="${role}">${role}</span><a href="mailto:${email}@refield.pl" aria-label="Napisz wiadomość: ${first} ${last}">${email}@refield.pl</a></div></div>
 </article>`).join('');
