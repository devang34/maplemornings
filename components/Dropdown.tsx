import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Dimensions } from 'react-native';
import { moderateScale } from '@/utils/spacing';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface DropdownProps {
  label: string;
  options: Array<{ label: string; value: string }>;
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, selectedValue, onValueChange }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsVisible(false); // Close dropdown after selection
  };

  const handleClearSelection = () => {
    onValueChange(''); // Clear the selected value
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={[styles.label, { fontStyle: 'italic', textAlign: 'center', fontSize: moderateScale(18), fontFamily: 'PoppinsMedium' }]}>
        {label}
      </Text>

      {/* Selected Value Display */}
      <TouchableOpacity style={styles.dropdown} onPress={() => setIsVisible(true)}>
        <Text style={styles.selectedText}>
          {options.find(option => option.value === selectedValue)?.label || 'Select an option'}
        </Text>
        {selectedValue ? (
          <TouchableOpacity onPress={handleClearSelection}>
            <Feather name="x-circle" size={moderateScale(20)} color="#424242BD" />
          </TouchableOpacity>
        ) : (
          <Feather name="chevron-down" size={moderateScale(20)} color="#424242BD" />
        )}
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal transparent visible={isVisible} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setIsVisible(false)}>
          <View style={styles.dropdownList}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => handleSelect(item.value)}>
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: moderateScale(15),
  },
  label: {
    fontSize: moderateScale(14),
    color: '#333',
    fontFamily: 'PoppinsSemiBold',
    marginBottom: moderateScale(8),
  },
  dropdown: {
    backgroundColor: '#FFF3E0',
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: moderateScale(14),
    color: '#424242BD',
    fontFamily: 'PoppinsRegular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownList: {
    width: width * 0.8,
    backgroundColor: '#FFF3E0',
    height: width * 0.6,
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(10),
  },
  option: {
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
  },
  optionText: {
    fontSize: moderateScale(14),
    color: '#333',
    fontFamily: 'PoppinsRegular',
  },
});

export default Dropdown;
