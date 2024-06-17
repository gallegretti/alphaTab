buildscript {
    repositories {
        gradlePluginPortal()
        google()
        mavenCentral()
    }
    dependencies {
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:2.0.0")
        classpath("com.android.tools.build:gradle:8.5.0")
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        maven("https://packages.jetbrains.team/maven/p/skija/maven")
    }
}

tasks.register("clean", Delete::class) {
    delete(rootProject.buildDir)
}
