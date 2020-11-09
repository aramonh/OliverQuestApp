ionic build --prod && (
	npx cap sync && del android/app/build/outputs/apk/release/app-release-unsigned.apk & (
		cd android && (
			gradlew assembleRelease && cd .. && (
				jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore firma.keystore android/app/build/outputs/apk/release/app-release-unsigned.apk firma -keypass lel123 -storepass lel123 && (
					del oliverApp.apk && (
						zipalign -v 4 android/app/build/outputs/apk/release/app-release-unsigned.apk oliverApp.apk && (
							adb install oliverApp.apk
						) || (
						  pause
						)
						pause
					) || (
					  pause
					)
				) || (
				  pause
				)	
			) || (
			  pause
			)
		) || (
		  pause
		)
	) || (
		  pause
		)
	)
) || (
	  pause
	)
)