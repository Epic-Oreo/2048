

const b = $("#undoButton").on("click", ()=>{
  undoButton()
})

const c = $("#clearUndo").on("click", ()=>{
  gmMain.storageManager.storage.setItem("undoState", JSON.stringify([]));
})


function undoButton () {

  const us = JSON.parse(gmMain.storageManager.storage.getItem("undoState"))

  if (us.length <= 1) return; // make sure there are more then two moves

  const last = us[1];

  us.shift();


  gmMain.storageManager.storage.setItem("gameState", JSON.stringify(last));
  gmMain.storageManager.storage.setItem("undoState", JSON.stringify(us));

  // 
  gmMain.grid = new Grid(last.grid.size, last.grid.cells);
  gmMain.actuate()


  // update undo count
  gmMain.storageManager.storage.setItem("undoCount", parseInt(gmMain.storageManager.storage.getItem("undoCount")) + 1)
  $("#undoButton").text(`Undo(${gmMain.storageManager.storage.getItem("undoCount")})`);

  
}

function updateUndoLog () {
  // fetch the old undo list
  let data = JSON.parse(gmMain.storageManager.storage.getItem("undoState"));

  // if it does not exist make one
  if (!data) {
    data = []
  }

  // add the current game state to the undo list
  data = [JSON.parse(gmMain.storageManager.storage.getItem("gameState")) ].concat(data);

  // if the list is over ten then remove the last item
  if (data.length > 10) {
    data.pop();
  }

  // set the undo state storage
  gmMain.storageManager.storage.setItem("undoState", JSON.stringify(data))
}


function genRandomFromSeed(seed) {
  prng1 = isaacCSPRNG(seed);
  return prng1.random();
}

function genRandomFromState() {
  return genRandomFromSeed(sha256(JSON.stringify(gmMain.grid)));
}

var sha256 = function sha256(string) {
  // stollen hehehehehehe
  ascii = [];
  for (var i = 0; i < string.length; i ++)
    ascii.push(string[i].charCodeAt(0));

	function rightRotate(value, amount) {
		return (value>>>amount) | (value<<(32 - amount));
	};
	
	var mathPow = Math.pow;
	var maxWord = mathPow(2, 32);
	var lengthProperty = 'length'
	var i, j; // Used as a counter across the whole file
	var result = ''

	var words = [];
	var asciiBitLength = ascii[lengthProperty]*8;
	
	//* caching results is optional - remove/add slash from front of this line to toggle
	// Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
	// (we actually calculate the first 64, but extra values are just ignored)
	var hash = sha256.h = sha256.h || [];
	// Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
	var k = sha256.k = sha256.k || [];
	var primeCounter = k[lengthProperty];
	/*/
	var hash = [], k = [];
	var primeCounter = 0;
	//*/

	var isComposite = {};
	for (var candidate = 2; primeCounter < 64; candidate++) {
		if (!isComposite[candidate]) {
			for (i = 0; i < 313; i += candidate) {
				isComposite[i] = candidate;
			}
			hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
			k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
		}
	}
	
	ascii += '\x80' // Append Ƈ' bit (plus zero padding)
	while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
	for (i = 0; i < ascii[lengthProperty]; i++) {
		j = ascii.charCodeAt(i);
		if (j>>8) return; // ASCII check: only accept characters in range 0-255
		words[i>>2] |= j << ((3 - i)%4)*8;
	}
	words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
	words[words[lengthProperty]] = (asciiBitLength)
	
	// process each chunk
	for (j = 0; j < words[lengthProperty];) {
		var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
		var oldHash = hash;
		// This is now the undefinedworking hash", often labelled as variables a...g
		// (we have to truncate as well, otherwise extra entries at the end accumulate
		hash = hash.slice(0, 8);
		
		for (i = 0; i < 64; i++) {
			var i2 = i + j;
			// Expand the message into 64 words
			// Used below if 
			var w15 = w[i - 15], w2 = w[i - 2];

			// Iterate
			var a = hash[0], e = hash[4];
			var temp1 = hash[7]
				+ (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
				+ ((e&hash[5])^((~e)&hash[6])) // ch
				+ k[i]
				// Expand the message schedule if needed
				+ (w[i] = (i < 16) ? w[i] : (
						w[i - 16]
						+ (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
						+ w[i - 7]
						+ (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
					)|0
				);
			// This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
			var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
				+ ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
			
			hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
			hash[4] = (hash[4] + temp1)|0;
		}
		
		for (i = 0; i < 8; i++) {
			hash[i] = (hash[i] + oldHash[i])|0;
		}
	}
	
	for (i = 0; i < 8; i++) {
		for (j = 3; j + 1; j--) {
			var b = (hash[i]>>(j*8))&255;
			result += ((b < 16) ? 0 : '') + b.toString(16);
		}
	}
	return result;
};