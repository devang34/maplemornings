import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View, StyleSheet, TextInputProps } from "react-native";

interface OtpInputFieldProps {
    setPinReady: (value: boolean) => void;
    code: string;
    setCode: (value: string) => void;
    maxLength: number;
    handleChange: (field: string, value: string) => void;
    handleSend: () => void;
}

const OtpInputField: React.FC<OtpInputFieldProps> = ({
    setPinReady,
    code,
    setCode,
    maxLength,
    handleChange,
    handleSend,
}) => {
    const [inputContainerIsFocused, setInputContainerIsFocused] = useState(false);

    const codeDigitsArray = new Array(maxLength).fill(0);

    const textInputRef = useRef<TextInput>(null);

    const handleOnBlur = () => {
        setInputContainerIsFocused(false);
    };

    const handleOnPress = () => {
        setInputContainerIsFocused(true);
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    };

    const toCodeDigitInput = (_value: number, index: number) => {
        const emptyInputChar = " ";
        const digit = code[index] || emptyInputChar;

        const isCurrentDigit = index === code.length;
        const isLastDigit = index === maxLength - 1;
        const isCodeFull = code.length === maxLength;

        const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull);

        return (
            <View
                key={index}
                style={[
                    styles.digitContainer,
                    inputContainerIsFocused && isDigitFocused ? styles.focused : styles.unfocused,
                ]}
            >
                <Text style={styles.digit}>{digit}</Text>
            </View>
        );
    };

    useEffect(() => {
        setPinReady(code.length === maxLength);
        return () => setPinReady(false);
    }, [code]);

    return (
        <View>
            <Pressable onPress={handleOnPress} style={styles.pressableContainer}>
                {codeDigitsArray.map(toCodeDigitInput)}
            </Pressable>
            <TextInput
                keyboardType="number-pad"
                maxLength={maxLength}
                value={code}
                onChangeText={(text) => handleChange("code", text)}
                ref={textInputRef}
                onBlur={handleOnBlur}
                onSubmitEditing={handleSend}
                returnKeyType="send"
                style={styles.hiddenInput}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    pressableContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    digitContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    focused: {
        borderBottomWidth: 2,
        borderColor: '#181818',
    },
    unfocused: {
        borderBottomWidth: 2,
        borderColor: '#181818',
    },
    digit: {
        fontSize: 18,
        fontFamily: 'PoppinsSemiBold',
        color: '#181818',
    },
    hiddenInput: {
        height: 1,
        width: 1,
        opacity: 0,
    },
});

export default OtpInputField;