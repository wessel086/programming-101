# User Stories met Acceptatiecriteria: Quick Click

Mijn User Stories zijn mijn idealen. De mogelijkheid dat alles niet is zoals dit, bestaat.

---

## Pagina & Navigatie

**Naam invoeren**
Als gebruiker wil ik mijn naam kunnen invoeren op het homescherm, zodat de pagina mij kan onthouden en mijn naam kan tonen.

De gebruiker voert een naam in via een invoerveld op het homescherm. De naam wordt opgeslagen via localStorage. De naam is zichtbaar op het homescherm na het invoeren.

**Gebruiker onthouden**
Als gebruiker wil ik dat de pagina mij onthoudt wanneer ik de pagina open, zodat mijn gegevens en voortgang bewaard blijven.

De gebruikersnaam of gegevens worden opgeslagen via localStorage. Bij het opnieuw openen van de pagina zijn de gegevens nog aanwezig. De gegevens verdwijnen niet na het sluiten van de browser.

**Homescherm**
Als gebruiker wil ik dat ik op het homescherm terechtkom wanneer ik de pagina open, zodat ik een duidelijk startpunt heb.

De homepagina is de eerste pagina die laadt. Het homescherm toont minimaal de titel, een level keuze en de knop "Start Game". Er is geen automatische redirect naar een andere pagina.

**Naar game.html**
Als gebruiker wil ik dat wanneer ik op de knop "Start Game" klik, de pagina game.html opent, zodat de game begint.

Klikken op "Start Game" opent game.html. De knop werkt alleen als er een level geselecteerd is. De pagina laadt zonder foutmeldingen.

---

## Countdown & Gamestart

**Countdown voor de game**
Als gebruiker wil ik dat er een countdown in beeld verschijnt zodra ik op "Start Game" heb geklikt, zodat ik weet wanneer de game begint.

De countdown toont de cijfers 5, 4, 3, 2, 1 elk precies 1 seconde. Na 1 verschijnt de tekst "Start!". De game start direct na "Start!" en targets kunnen nog niet geklikt worden tijdens de countdown. De game timer start pas na de countdown.

---

## Game: Canvas & Targets

**Canvas grootte**
Als gebruiker wil ik dat de targets spawnen op een canvas dat 80% van de schermhoogte inneemt, zodat er ruimte is voor de UI bovenin.

Het canvas beslaat 80% van de schermhoogte, gemeten vanaf de onderkant. De bovenste 20% is vrij voor de UI. Targets spawnen nooit buiten het canvas.

**Maximaal aantal targets**
Als gebruiker wil ik dat er maximaal 5 targets tegelijk op het scherm staan, zodat het scherm niet te druk wordt.

Er staan nooit meer dan 5 targets tegelijk op het scherm. Een nieuwe target spawnt pas als er minder dan 5 actief zijn. Dit geldt voor alle target types samen.

**Spawn kansen per target**
Als gebruiker wil ik dat targets met de juiste kansen spawnen, zodat de game gevarieerd blijft.

Een normaal target heeft 90% kans om te spawnen. Een time target heeft 10% kans om te spawnen. Een gold target heeft 7% kans om te spawnen. De kansen worden bepaald via een random getal bij elke spawn.

**Target grootte**
Als gebruiker wil ik dat alle targets standaard een diameter hebben van 10% van de schermbreedte, zodat ze goed zichtbaar zijn.

De diameter van een target is gelijk aan 10% van de breedte van het scherm. De grootte past zich aan als het scherm van formaat verandert. In level 4 zijn targets 40% kleiner dan de standaard grootte.

**Target positie**
Als gebruiker wil ik dat targets op een willekeurige positie binnen het canvas spawnen, zodat de game onvoorspelbaar is.

Elke target spawnt op een willekeurige X en Y positie binnen het canvas. Een target staat nooit buiten de grenzen van het canvas. De positie wordt bepaald via `circle(randomX, randomY, diameter)`.

---

## Game: Target types & kleuren

**Normaal target (grijs)**
Als gebruiker wil ik dat een normaal target grijs is en bij klikken 1 punt geeft.

Het target heeft de kleur grijs via `fill("gray")`. Het target verdwijnt na 5 seconden als het niet geklikt wordt. Klikken op het target geeft +1 punt. Het target verdwijnt direct na een klik.

**Time target (groen)**
Als gebruiker wil ik dat een time target groen is en bij klikken 3 seconden toevoegt aan de timer.

Het target heeft de kleur groen via `fill("green")`. Het target verdwijnt na 3 seconden als het niet geklikt wordt. Klikken op het target voegt +3 seconden toe aan de timer. Het target verdwijnt direct na een klik.

**Gold target (goud)**
Als gebruiker wil ik dat een gold target goud is en bij klikken 5 punten geeft.

Het target heeft de kleur goud via `fill("gold")`. Het target verdwijnt na 3 seconden als het niet geklikt wordt. Klikken op het target geeft +5 punten. Het target verdwijnt direct na een klik.

---

## Game: Timer & Score

**Starttimer**
Als gebruiker wil ik dat de timer begint op 00:30 zodra de game start, zodat ik weet hoeveel tijd ik heb.

De timer toont 00:30 bij de start van de game. De timer telt af in seconden. De timer is zichtbaar in de UI bovenin het scherm. De timer stopt als hij 00:00 bereikt.

**Startscore**
Als gebruiker wil ik dat de score op 0 staat wanneer de game start.

De score toont 0 bij de start van elke game. De score is zichtbaar in de UI bovenin het scherm. Bij opnieuw spelen wordt de score gereset naar 0.

**Score zichtbaar tijdens het spelen**
Als gebruiker wil ik de huidige score zien terwijl ik speel, zodat ik weet hoe ik het doe.

De score wordt live bijgewerkt na elke klik. De score staat altijd zichtbaar op het scherm tijdens het spelen.

---

## Game: Straffen

**Missen**
Als gebruiker wil ik dat wanneer ik klik maar niet op een target tref, er 2 seconden van de timer afgaan.

Een klik buiten een target trekt 2 seconden van de timer af. Dit wordt bijgehouden als een miss. De timer kan niet onder 00:00 komen door een miss.

**Target verdwijnt zonder klik**
Als gebruiker wil ik dat wanneer een target zijn tijd op het scherm heeft gehad zonder geklikt te worden, hij verdwijnt en er 2 seconden van de timer afgaan.

Het target verdwijnt automatisch na zijn maximale tijd op het scherm. Bij het verdwijnen gaan er 2 seconden van de timer af. Dit geldt voor alle target types.

---

## Visuele feedback

**Visuele reactie bij klikken**
Als gebruiker wil ik een visuele reactie zien als ik een target raak of mis, zodat ik direct weet of mijn klik goed was.

Bij een raak wordt kort een kleurverandering of animatie getoond op de plek van het target. Bij een miss wordt kort een visueel effect getoond op de klikpositie. De feedback duurt maximaal 0.5 seconde.

---

## Highscore

**Highscore opslaan**
Als gebruiker wil ik mijn hoogste score zien op het homescherm, zodat ik weet wat mijn record is.

De highscore wordt opgeslagen via localStorage. De highscore is zichtbaar op het homescherm. De highscore wordt alleen bijgewerkt als de nieuwe score hoger is dan de vorige.

---

## Game Over

**Game over scherm**
Als gebruiker wil ik dat wanneer de timer op 00:00 staat, het game over scherm verschijnt.

Het game over scherm verschijnt direct als de timer 00:00 bereikt. De eindscore en de highscore zijn zichtbaar op het game over scherm, zodat de speler direct ziet of hij een record heeft gehaald. De game stopt volledig en er kunnen geen targets meer geklikt worden.

**Opnieuw spelen**
Als gebruiker wil ik op het game over scherm een knop "Opnieuw" zien die het huidige level opnieuw start.

De knop "Opnieuw" is zichtbaar op het game over scherm. Klikken op "Opnieuw" herstart het huidige level. De score en timer worden gereset naar de beginwaarden.

**Terug naar menu**
Als gebruiker wil ik op het game over scherm een knop "Menu" zien die mij terugbrengt naar het homescherm.

De knop "Menu" is zichtbaar op het game over scherm. Klikken op "Menu" brengt de gebruiker terug naar index.html. De game stopt volledig bij het klikken op "Menu".

---

## Levels

**Level keuze op homescherm**
Als gebruiker wil ik op het homescherm een level kunnen kiezen voordat ik de game start.

Er zijn 4 levels zichtbaar op het homescherm. Een level moet geselecteerd zijn voordat "Start Game" werkt. Het geselecteerde level is visueel duidelijk zichtbaar.

**Level 1**
Als gebruiker wil ik dat in level 1 de targets de standaard snelheid hebben.

Normaal target staat 5 seconden op het scherm. Time target staat 3 seconden op het scherm. Gold target staat 3 seconden op het scherm.

**Level 2**
Als gebruiker wil ik dat in level 2 alle targets 1 seconde korter op het scherm staan dan standaard.

Normaal target staat 4 seconden op het scherm. Time target staat 2 seconden op het scherm. Gold target staat 2 seconden op het scherm.

**Level 3**
Als gebruiker wil ik dat in level 3 alle targets 2 seconden korter op het scherm staan dan standaard.

Normaal target staat 3 seconden op het scherm. Time target staat 1 seconde op het scherm. Gold target staat 1 seconde op het scherm.

**Level 4**
Als gebruiker wil ik dat in level 4 alle targets 2 seconden korter staan, 40% kleiner zijn en alleen met de linkermuisknop geklikt kunnen worden.

Alle tijden zijn gelijk aan level 3. Alle targets zijn 40% kleiner dan de standaard diameter. Alleen een klik met de linkermuisknop telt als een geldige klik. Een klik met de rechtermuisknop telt als een miss.