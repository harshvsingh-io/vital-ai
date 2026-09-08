import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";
import { useAppTheme } from "@/theme/ThemeContext";

import { HomeScreen } from "@/screens/Dashboard/HomeScreen";
import { AIChatScreen } from "@/screens/AIChat/AIChatScreen";
import { HealthProfileScreen } from "@/screens/Health/HealthProfileScreen";
import { VitalsTrackerScreen } from "@/screens/Health/VitalsTrackerScreen";
import { MedicationReminderScreen } from "@/screens/Health/MedicationReminderScreen";
import { MoodJournalScreen } from "@/screens/Health/MoodJournalScreen";
import { AppointmentsScreen } from "@/screens/Appointments/AppointmentsScreen";
import { DoctorSearchScreen } from "@/screens/Appointments/DoctorSearchScreen";
import { BookAppointmentScreen } from "@/screens/Appointments/BookAppointmentScreen";
import { EmergencySOSScreen } from "@/screens/Emergency/EmergencySOSScreen";
import { ProfileScreen } from "@/screens/Profile/ProfileScreen";
import { SettingsScreen } from "@/screens/Profile/SettingsScreen";
import { AboutScreen } from "@/screens/Profile/AboutScreen";
import { MedicalRecordsScreen } from "@/screens/Profile/MedicalRecordsScreen";
import { VaccinationsScreen } from "@/screens/Profile/VaccinationsScreen";

export type HealthStackParamList = {
  HealthProfile: undefined;
  VitalsTracker: undefined;
  MedicationReminder: undefined;
  MoodJournal: undefined;
};

export type AppointmentsStackParamList = {
  AppointmentsList: undefined;
  DoctorSearch: undefined;
  BookAppointment: { doctorId: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Settings: undefined;
  About: undefined;
  HealthProfile: undefined;
  MedicalRecords: undefined;
  Vaccinations: undefined;
};

const Tab = createBottomTabNavigator();
const HealthStack = createNativeStackNavigator<HealthStackParamList>();
const AppointmentsStack = createNativeStackNavigator<AppointmentsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const HealthStackNavigator = () => (
  <HealthStack.Navigator screenOptions={{ headerShown: false }}>
    <HealthStack.Screen name="HealthProfile" component={HealthProfileScreen} />
    <HealthStack.Screen name="VitalsTracker" component={VitalsTrackerScreen} />
    <HealthStack.Screen name="MedicationReminder" component={MedicationReminderScreen} />
    <HealthStack.Screen name="MoodJournal" component={MoodJournalScreen} />
  </HealthStack.Navigator>
);

const AppointmentsStackNavigator = () => (
  <AppointmentsStack.Navigator screenOptions={{ headerShown: false }}>
    <AppointmentsStack.Screen name="AppointmentsList" component={AppointmentsScreen} />
    <AppointmentsStack.Screen name="DoctorSearch" component={DoctorSearchScreen} />
    <AppointmentsStack.Screen name="BookAppointment" component={BookAppointmentScreen} />
  </AppointmentsStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
    <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    <ProfileStack.Screen name="About" component={AboutScreen} />
    <ProfileStack.Screen name="HealthProfile" component={HealthProfileScreen} />
    <ProfileStack.Screen name="MedicalRecords" component={MedicalRecordsScreen} />
    <ProfileStack.Screen name="Vaccinations" component={VaccinationsScreen} />
  </ProfileStack.Navigator>
);

const TabIcon = ({ symbol, focused, color }: { symbol: string; focused: boolean; color: string }) => (
  <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6, color }}>{symbol}</Text>
);

export const MainTabNavigator = () => {
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          height: 88,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused, color }) => <TabIcon symbol="◈" focused={focused} color={color} /> }}
      />
      <Tab.Screen
        name="Health"
        component={HealthStackNavigator}
        options={{ tabBarIcon: ({ focused, color }) => <TabIcon symbol="♥" focused={focused} color={color} /> }}
      />
      <Tab.Screen
        name="AIChat"
        component={AIChatScreen}
        options={{
          tabBarLabel: "AI Assistant",
          tabBarIcon: ({ focused, color }) => <TabIcon symbol="✦" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentsStackNavigator}
        options={{ tabBarIcon: ({ focused, color }) => <TabIcon symbol="⌘" focused={focused} color={color} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{ tabBarIcon: ({ focused, color }) => <TabIcon symbol="●" focused={focused} color={color} /> }}
      />
    </Tab.Navigator>
  );
};
