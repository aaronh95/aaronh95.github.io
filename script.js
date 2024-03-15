await WebMidi.enable();

let myInput = WebMidi.inputs[0];
let myOutput = WebMidi.outputs[0];

//gather elements

let dropIns = document.getElementById("dropdown-ins");
let dropOuts = document.getElementById("dropdown-outs");
let slider1 = document.getElementById("slide1")
let slider2 = document.getElementById("slide2")

//Update Slider

slider1.addEventListener("change", function(){
     document.getElementById("harmony1amt").innerText=`${slider1.value} semitones`
})
slider2.addEventListener("change", function(){
    document.getElementById("harmony2amt").innerText=`${slider2.value} semitones`
})
//input & output dropdown

WebMidi.inputs.forEach(function (input, num){
    dropIns.innerHTML += `<option value=${num}>${input.name}</option>`
})
WebMidi.outputs.forEach(function (output, num) {
    dropOuts.innerHTML += `<option value=${num}>${output.name}</option>`;
  });

  // change event listener

  dropIns.addEventListener("change", function (){
    if(myInput.hasListener("noteon")){
        myInput.removeListener("noteon")
    }
    if(myInput.hasListener("noteoff")){
        myInput.removeListener("noteoff")
    }
  })

  myInput=WebMidi.inputs[dropIns.value]

  //the actual harmonizer thing

  const harmonizer = function (midiInput){
    let root = midiInput.note.number
    let harmony1 = midiInput.note.number + parseInt(slider1.value);
    let harmony2 = midiInput.note.number + parseInt(slider2.value);
    let velocity = midiInput.note.rawAttack

    let rootOut= new Note (root, {rawAttack: velocity});
    let harm1Out= new Note (harmony1, {rawAttack: velocity});
    let harm2Out= new Note (harmony2, {rawAttack: velocity});
    return(rootOut, harm1Out, harm2Out)
  };

  //note on/off listener

  myInput.addListener("noteon", function(midiValue){
    myOutput.sendNoteOn(harmonizer(midiValue));
  });

  myInput.addListener("noteoff", function (midiValue){
    myOutput.sendNoteOff(harmonizer(midiValue))
  });

  dropOuts.addEventListener("change", function (){
    myOutput = WebMidi.outputs[dropOuts.value].channels[1]
  })