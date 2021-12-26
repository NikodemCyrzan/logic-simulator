# Instrukcja

## Tworzenie układu scalonego

Aby powstał nowy układ scalony, tworzy się instancję klasy <code>Circuit</code>. Na przykład:

    new Circuit(2, 1);

Tworzy układ scalony z dwoma wejściami i jednym wyjściem.

## Dodawanie wejść i wyjść

Służą do tego dwie metody: <code>addInput</code> i <code>addOutput</code>. Obie nie przyjmują żadnych parametrów.

## Usuwanie wejść i wyjść

Służą do tego dwie metody: <code>removeInput</code> i <code>removeOutput</code>. Obie przyjmują parametr index typu <code>number</code>.

## Tworzenie bramek

<p>
Układ scalony jest zbudowany z mniejszych elementów, czyli bramek. One zajmują się wszystkimi obliczeniami.
</p>
<p>
Można stworzyć nową bramkę, lub użyć funkcji zwracających nową instancję przygotowanych już bramek <code>AND</code> oraz <code>NOT</code>.
</p>
<p>
Aby stworzyć nową bramkę, trzeba najpierw napisać jej kod:

    (inputs: Array<Connection>, outputs: Array<Connection>) => any

Funkcja nie zwraca żadnych wartości, a wyjścia muszą być przypisane we wnętrzu. Przykładowy kod bramki AND (TypeScript):

    const andCode = (inputs: Array<Connection>, outputs: Array<Connection>): any => {
    outputs[0].setState(inputs[0].state == 1 && inputs[1].state == 1 ? 1 : 0);
    }

Następnie tworzy się instancję klasy <code>Gate</code>, która przyjmuje jako parametry: funkcję, ilość wejść oraz ilość wyjść.

    new Gate(code, 2, 1);
</p>

## Łączenie bramek z układem scalonym

Służą do tego trzy metody zawarte w klasie <code>Circuit</code>. <code>connectGateToInput</code>, <code>connectGateToOutput</code> oraz <code>connectGates</code>.

### connectGateToInput

Przyjmuje 4 parametry. Indeks wejścia układu scalonego, instancję bramki, index wejścia bramki oraz instancję klasy <code>Connection</code>.

    let circuit = new Circuit(1, 1);
    let not = new Gate(notCode, 1, 1);

    circuit.connectGateToInput(0, not, 0, new Connection());

### connectGates

Przyjmuje 4 parametry. Bramkę z której chcemy połączyć wyjście, indeks wyjścia, bramkę z której chcemy połączyć wejście, indeks wejścia.

    let circuit = new Circuit(1, 1);
    let not1 = new Gate(notCode, 1, 1);
    let not2 = new Gate(notCode, 1, 1);

    circuit.connectGates(not1, 0, not2, 0, new Connection(0, not2, not1));

### connectGateToOutput

Przyjmuje 4 parametry. Indeks wyjścia układu scalonego, instancję bramki, index wyjścia bramki oraz instancję klasy <code>Connection</code>.

    let circuit = new Circuit(1, 1);
    let not = new Gate(notCode, 1, 1);

    circuit.connectGateToOutput(0, not, 0, new Connection(0, null, not));

## Zmiana stanu połączenia

Stan może wynosić 1 lub 0, co oznacza prąd płynący przez połączenie, lub nie. Można go zmienić za pomocą metody <code>setState</code> wbudowanej w klasę <code>Connection</code>.

    let circuit = new Circuit(1, 1);
    let not1 = new Gate(notCode, 1, 1);
    let not2 = new Gate(notCode, 1, 1);

    circuit.connectGateToInput(0, not, 0, new Connection(0, not));
    circuit.connectGateToOutput(0, not2, 0, new Connection(0, null, not2));
    circuit.connectGates(not1, 0, not2, 0);

    circuit.inputs[0].setState(1);

## Wykonywanie obliczeń

<p>
Bramki automatycznie wykonują obliczenia za każdym razem gdy połączy się je z innymi bramkami za pomocą wbudowanych metod.
</p>
<p>
Istnieje możliwość ręczniego uruchomienia obliczeń bramki za pomocą metody <code>code</code> wbudowanej w klasę <code>Gate</code>.

    let gate = new Gate(gateCode, 1, 1);
    gate.code();
</p>