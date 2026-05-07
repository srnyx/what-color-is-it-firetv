const fontStyles = ["Arial", "Courier New", "Times New Roman", "Verdana"];

let is12HourFormat = true;
let fontSize = 100;
let fontStyle = 0;
let fontNotification = null;

const MIN_FONT_SIZE = 20;
const FONT_NOTIFICATION_RATIO = 0.35;
const FONT_SIZE_STEP = 10;

/**
 * Update time and background color
 */
function updateScreen() {
	// Get time
	const date = new Date();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();

	// Get time element
	const timeElement = document.getElementById("time");

	// Set current time
	let hoursDisplay = hours;
	if (is12HourFormat) hoursDisplay = hours % 12 || 12;
	const minutesDisplay = minutes < 10 ? "0" + minutes : minutes;
	const secondsDisplay = seconds < 10 ? "0" + seconds : seconds;
	timeElement.innerHTML = (hoursDisplay + " : " + minutesDisplay + " : " + secondsDisplay);

	// Set color (HSV)
	const totalSeconds = hours * 3600 + minutes * 60 + seconds;
	const hue = (totalSeconds / 86400) * 360; // Change hue based on time of day
	document.body.style.background = "hsl(" + hue + ", 100%, 50%)";
	const textColor = getReadableTextColor(hue);
	timeElement.style.color = textColor;
	document.getElementById("font").style.color = textColor;
}

/**
 * Update font style and show notification
 * 
 * @param	change	Number of font styles to travel (positive or negative)
 */
function updateFontStyle(change) {
	fontStyle = (fontStyle + change + fontStyles.length) % fontStyles.length;
	const fontFamily = fontStyles[fontStyle] + ", sans-serif";
	document.getElementById("time").style.fontFamily = fontFamily;
	document.getElementById("font").style.fontFamily = fontFamily;
}

/**
 * Update font size and show notification
 * 
 * @param	newFontSize	New font size in pixels
 */
function updateFontSize(newFontSize) {
	fontSize = Math.max(MIN_FONT_SIZE, newFontSize);
	const timeElement = document.getElementById("time");
	const fontElement = document.getElementById("font");
	document.body.style.setProperty("--time-size", fontSize + "px");
	timeElement.style.fontSize = fontSize + "px";
	fontElement.style.fontSize = Math.max(MIN_FONT_SIZE, Math.round(fontSize * FONT_NOTIFICATION_RATIO)) + "px";
}

/**
 * Display font size notification for 2 seconds
 * 
 * @param 	message	Notification message to display (font name or size)
 */
function displayFontNotification(message) {
	const fontElement = document.getElementById("font");
	if (fontNotification) clearTimeout(fontNotification);
	fontElement.innerHTML = message;
	fontNotification = setTimeout(() => {
		fontElement.innerHTML = "";
	}, 2000);
}

/**
 * Keep dummy video playing in the background to prevent TV from turning off
 */
function keepVideoPlaying() {
	const video = document.querySelector("video");
	if (!video) return;
	video.play().catch(() => {});
}

window.onload = () => {
	updateScreen();
	updateFontStyle(0);
	updateFontSize(getIdealTimeSize());
	keepVideoPlaying();
	
	// Intervals
	setInterval(keepVideoPlaying, 15000);
	setInterval(updateScreen, 1000);

	// Event listeners
	window.addEventListener("resize", () => updateFontSize(getIdealTimeSize()));
	window.addEventListener("focus", keepVideoPlaying);
	document.addEventListener("visibilitychange", keepVideoPlaying);
	/*
	 * Select (D-pad Center): 13
	 * Up (D-pad): 38
	 * Down (D-pad): 40
	 * Left (D-pad): 37
	 * Right (D-pad): 39
	 * Play/Pause: 179
	 * Rewind: 227
	 * Fast Forward: 228
	 * Back: 4
	 */
	document.addEventListener("keydown", function (e) {
		// Select (D-pad Center) or spacebar
		// Switch between 12-hour and 24-hour display
		if (e.keyCode === 13 || e.code === "Space") {
			is12HourFormat = !is12HourFormat;
			updateScreen();
			return false;
		}

		// Right (D-pad) or right arrow
		// Go to next font style
		if (e.keyCode === 39 || e.code === "ArrowRight") {
			updateFontStyle(1);
			displayFontNotification(fontStyles[fontStyle]);
			return false;
		}

		// Left (D-pad) or left arrow
		// Go to previous font style
		if (e.keyCode === 37 || e.code === "ArrowLeft") {
			updateFontStyle(-1);
			displayFontNotification(fontStyles[fontStyle]);
			return false;
		}

		// Up (D-pad) or up arrow
		// Increase font size
		if (e.keyCode === 38 || e.code === "ArrowUp") {
			updateFontSize(Math.round((fontSize + FONT_SIZE_STEP) / FONT_SIZE_STEP) * FONT_SIZE_STEP);
			displayFontNotification(fontSize);
			return false;
		}

		// Down (D-pad) or down arrow
		// Decrease font size
		if (e.keyCode === 40 || e.code === "ArrowDown") {
			updateFontSize(Math.round((fontSize - FONT_SIZE_STEP) / FONT_SIZE_STEP) * FONT_SIZE_STEP);
			displayFontNotification(fontSize);
			return false;
		}
	})
}

/**
 * Calculate ideal font size based on window dimensions
 *
 * @returns	{number}	Ideal font size in pixels
 */
function getIdealTimeSize() {
    return Math.round(Math.min(window.innerWidth * 0.15, window.innerHeight * 0.25));
}

/**
 * Get readable text color based on background color
 * 
 * @param		hue				Background hue (0-360)
 * 
 * @returns	{string}	Readable text color in HSL format
 */
function getReadableTextColor(hue) {
	// Convert HSL to RGB to estimate brightness
	const [red, green, blue] = hslToRgb(hue, 100, 80);

	// Perceived luminance
	const luminance =
		0.2126 * red +
		0.7152 * green +
		0.0722 * blue;

	// Bright backgrounds -> dark text
	// Dark backgrounds -> light text
	const textLightness = luminance > 140 ? 15 : 85;

	// Slightly reduce saturation for readability
	const textSaturation = 80;

	return `hsl(${hue}, ${textSaturation}%, ${textLightness}%)`;
}

/**
 * Convert HSL color to RGB
 * 
 * @param 	hue					Hue (0-360)
 * @param 	saturation	Saturation (0-100)
 * @param 	lightness		Lightness (0-100)
 * 
 * @returns	{number[]}	RGB values (0-255) as an array [red, green, blue]
 */
function hslToRgb(hue, saturation, lightness) {
	// Convert saturation and lightness to 0-1 range
	saturation /= 100;
	lightness /= 100;
	
	// Angle of color wheel at given hue
	const angle = n => (n + hue / 30) % 12;
	// Chroma (determines intensity of color based on saturation and lightness)
	const chroma = saturation * Math.min(lightness, 1 - lightness);
	// Calculates intensity of red, green, or blue component based on hue angle and chroma
	const intensity = n => lightness - chroma * Math.max(-1, Math.min(angle(n) - 3, Math.min(9 - angle(n), 1)));
	
	// Convert to RGB values (0-255)
	return [
		Math.round(255 * intensity(0)),
		Math.round(255 * intensity(8)),
		Math.round(255 * intensity(4))
	];
}
