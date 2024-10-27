// CalendarComponent.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

type CalendarComponentProps = {
  selectedDate: string | undefined;
  onDateSelect: (date: string) => void;
};

const CalendarComponent: React.FC<CalendarComponentProps> = ({ selectedDate, onDateSelect }) => {
  useEffect(() => {
    // Permet de mettre à jour la sélection si la date sélectionnée est réinitialisée
  }, [selectedDate]);

  const onDayPress = (day: { dateString: string }) => {
    onDateSelect(day.dateString);
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={selectedDate ? { [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' } } : {}}
        theme={{
          todayTextColor: 'blue',
          selectedDayBackgroundColor: 'blue',
          selectedDayTextColor: 'white',
          arrowColor: 'blue',
        }}
      />
      {selectedDate && <Text style={styles.selectedDateText}>Date sélectionnée : {selectedDate}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  selectedDateText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default CalendarComponent;
