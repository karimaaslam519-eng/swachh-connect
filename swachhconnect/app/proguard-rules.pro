# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in defaultProguardFile("proguard-android-optimize.txt")

# Kotlin Coroutines
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
-keepclassmembernames class kotlinx.coroutines.** {
    volatile <fields>;
}

# Jetpack Compose
-keep class androidx.compose.material3.** { *; }
-dontwarn androidx.compose.**
