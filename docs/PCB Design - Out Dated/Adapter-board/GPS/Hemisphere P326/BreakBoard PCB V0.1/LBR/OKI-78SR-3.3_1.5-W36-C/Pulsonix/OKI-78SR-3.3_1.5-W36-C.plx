PULSONIX_LIBRARY_ASCII "SamacSys ECAD Model"
//800730/154315/2.46/3/4/Integrated Circuit

(asciiHeader
	(fileUnits MM)
)
(library Library_1
	(padStyleDef "c150_h100"
		(holeDiam 1)
		(padShape (layerNumRef 1) (padShapeType Ellipse)  (shapeWidth 1.500) (shapeHeight 1.500))
		(padShape (layerNumRef 16) (padShapeType Ellipse)  (shapeWidth 1.500) (shapeHeight 1.500))
	)
	(textStyleDef "Normal"
		(font
			(fontType Stroke)
			(fontFace "Helvetica")
			(fontHeight 1.27)
			(strokeWidth 0.127)
		)
	)
	(patternDef "OKI78SR3315W36C" (originalName "OKI78SR3315W36C")
		(multiLayer
			(pad (padNum 1) (padStyleRef c150_h100) (pt -2.540, -0.300) (rotation 90))
			(pad (padNum 2) (padStyleRef c150_h100) (pt 0.000, -0.300) (rotation 90))
			(pad (padNum 3) (padStyleRef c150_h100) (pt 2.540, -0.300) (rotation 90))
		)
		(layerContents (layerNumRef 18)
			(attr "RefDes" "RefDes" (pt 0.000, 0.000) (textStyleRef "Normal") (isVisible True))
		)
		(layerContents (layerNumRef 28)
			(line (pt -5.2 4.6) (pt 5.2 4.6) (width 0.025))
		)
		(layerContents (layerNumRef 28)
			(line (pt 5.2 4.6) (pt 5.2 -4) (width 0.025))
		)
		(layerContents (layerNumRef 28)
			(line (pt 5.2 -4) (pt -5.2 -4) (width 0.025))
		)
		(layerContents (layerNumRef 28)
			(line (pt -5.2 -4) (pt -5.2 4.6) (width 0.025))
		)
		(layerContents (layerNumRef 18)
			(line (pt -5.2 4.6) (pt 5.08 4.6) (width 0.1))
		)
		(layerContents (layerNumRef 18)
			(line (pt 5.08 4.6) (pt 5.08 -4) (width 0.1))
		)
		(layerContents (layerNumRef 18)
			(line (pt 5.08 -4) (pt -5.2 -4) (width 0.1))
		)
		(layerContents (layerNumRef 18)
			(line (pt -5.2 -4) (pt -5.2 4.6) (width 0.1))
		)
		(layerContents (layerNumRef Courtyard_Top)
			(line (pt -6.2 5.6) (pt 6.2 5.6) (width 0.1))
		)
		(layerContents (layerNumRef Courtyard_Top)
			(line (pt 6.2 5.6) (pt 6.2 -5.6) (width 0.1))
		)
		(layerContents (layerNumRef Courtyard_Top)
			(line (pt 6.2 -5.6) (pt -6.2 -5.6) (width 0.1))
		)
		(layerContents (layerNumRef Courtyard_Top)
			(line (pt -6.2 -5.6) (pt -6.2 5.6) (width 0.1))
		)
		(layerContents (layerNumRef 18)
			(line (pt -2.6 -4.5) (pt -2.6 -4.5) (width 0.2))
		)
		(layerContents (layerNumRef 18)
			(arc (pt -2.5, -4.5) (radius 0.1) (startAngle 180.0) (sweepAngle -180.0) (width 0.2))
		)
		(layerContents (layerNumRef 18)
			(line (pt -2.4 -4.5) (pt -2.4 -4.5) (width 0.2))
		)
		(layerContents (layerNumRef 18)
			(arc (pt -2.5, -4.5) (radius 0.1) (startAngle .0) (sweepAngle -180.0) (width 0.2))
		)
	)
	(symbolDef "OKI-78SR-3.3_1.5-W36-C" (originalName "OKI-78SR-3.3_1.5-W36-C")

		(pin (pinNum 1) (pt 0 mils 0 mils) (rotation 0) (pinLength 200 mils) (pinDisplay (dispPinName true)) (pinName (text (pt 230 mils -25 mils) (rotation 0]) (justify "Left") (textStyleRef "Normal"))
		))
		(pin (pinNum 2) (pt 0 mils -100 mils) (rotation 0) (pinLength 200 mils) (pinDisplay (dispPinName true)) (pinName (text (pt 230 mils -125 mils) (rotation 0]) (justify "Left") (textStyleRef "Normal"))
		))
		(pin (pinNum 3) (pt 0 mils -200 mils) (rotation 0) (pinLength 200 mils) (pinDisplay (dispPinName true)) (pinName (text (pt 230 mils -225 mils) (rotation 0]) (justify "Left") (textStyleRef "Normal"))
		))
		(line (pt 200 mils 100 mils) (pt 1300 mils 100 mils) (width 6 mils))
		(line (pt 1300 mils 100 mils) (pt 1300 mils -300 mils) (width 6 mils))
		(line (pt 1300 mils -300 mils) (pt 200 mils -300 mils) (width 6 mils))
		(line (pt 200 mils -300 mils) (pt 200 mils 100 mils) (width 6 mils))
		(attr "RefDes" "RefDes" (pt 1350 mils 300 mils) (justify Left) (isVisible True) (textStyleRef "Normal"))
		(attr "Type" "Type" (pt 1350 mils 200 mils) (justify Left) (isVisible True) (textStyleRef "Normal"))

	)
	(compDef "OKI-78SR-3.3_1.5-W36-C" (originalName "OKI-78SR-3.3_1.5-W36-C") (compHeader (numPins 3) (numParts 1) (refDesPrefix IC)
		)
		(compPin "1" (pinName "POSITIVE INPUT") (partNum 1) (symPinNum 1) (gateEq 0) (pinEq 0) (pinType Unknown))
		(compPin "2" (pinName "COMMON (GROUND)") (partNum 1) (symPinNum 2) (gateEq 0) (pinEq 0) (pinType Unknown))
		(compPin "3" (pinName "POSITIVE OUTPUT") (partNum 1) (symPinNum 3) (gateEq 0) (pinEq 0) (pinType Unknown))
		(attachedSymbol (partNum 1) (altType Normal) (symbolName "OKI-78SR-3.3_1.5-W36-C"))
		(attachedPattern (patternNum 1) (patternName "OKI78SR3315W36C")
			(numPads 3)
			(padPinMap
				(padNum 1) (compPinRef "1")
				(padNum 2) (compPinRef "2")
				(padNum 3) (compPinRef "3")
			)
		)
		(attr "Manufacturer_Name" "Murata Electronics")
		(attr "Manufacturer_Part_Number" "OKI-78SR-3.3/1.5-W36-C")
		(attr "Mouser Part Number" "580-OKI78SR3.31.536C")
		(attr "Mouser Price/Stock" "https://www.mouser.co.uk/ProductDetail/Murata-Power-Solutions/OKI-78SR-33-15-W36-C?qs=uJpRT2lXVNX73zEQlCgxZA%3D%3D")
		(attr "RS Part Number" "7962141P")
		(attr "RS Price/Stock" "http://uk.rs-online.com/web/p/products/7962141P")
		(attr "Description" "Murata Power Solutions Switching Regulator, 3.3V dc Output, 1.5A")
		(attr "<Hyperlink>" "https://power.murata.com/data/power/oki-78sr.pdf")
		(attr "<Component Height>" "16")
		(attr "<STEP Filename>" "OKI-78SR-3.3_1.5-W36-C.stp")
		(attr "<STEP Offsets>" "X=0;Y=0;Z=0")
		(attr "<STEP Rotation>" "X=0;Y=0;Z=0")
	)

)
