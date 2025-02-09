import { Platform, StyleSheet, Text, TextStyle, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { FONTS } from '../../constants/Fonts';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../constants/Colors';

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7'
type PlatformType = "android" | "ios";

interface CustomTextProps {
    variant?: Variant;
    fontFamily?: FONTS;
    fontSize?: number;
    color?: string;
    style?: TextStyle | TextStyle[];
    children?: React.ReactNode;
    numberOfLines?: number;
    onLayout?: (event: object) => void,
    onMentionPress?: (mention: string) => void
}

const fontSizeMap: Record<Variant, Record<PlatformType, number>> = {
    h1: { android: 24, ios: 22 },
    h2: { android: 22, ios: 20 },
    h3: { android: 20, ios: 18 },
    h4: { android: 18, ios: 16 },
    h5: { android: 16, ios: 14 },
    h6: { android: 14, ios: 12 },
    h7: { android: 12, ios: 10 },
}

const CustomText: FC<CustomTextProps> = ({
    variant,
    fontFamily,
    fontSize,
    style,
    color,
    children,
    numberOfLines,
    onLayout,
    onMentionPress,
    ...props
}) => {

    let computedFontSize: number = Platform.OS === 'android' ? RFValue(fontSize || 12) : RFValue(fontSize || 10);
    if (variant && fontSizeMap[variant]) {
        const defaultSize = fontSizeMap[variant][Platform.OS as PlatformType]
        computedFontSize = RFValue(fontSize || defaultSize)
    }

    const handleUserPress = async (mention: string) => {}

    const renderTextWithMentions = (text: string): JSX.Element[] => {
        const mentionRegex = /@(\w+)/g;
        let lastIndex = 0;
        const elements: JSX.Element[] = [];
        let match;

        while ((match = mentionRegex.exec(text)) !== null) {
            const mention = match[1];
            const plainTextBeforeMention = text.substring(lastIndex, match.index);
            if (plainTextBeforeMention) {
                elements.push(
                    <Text
                        onLayout={onLayout}
                        numberOfLines={
                            numberOfLines !== undefined ? numberOfLines : undefined
                        }
                        key={lastIndex}
                        style={[
                            styles.text,
                            {
                                color: Colors.text,
                                fontSize: computedFontSize,
                                fontFamily: fontFamily,
                            },
                            style,
                        ]}>
                        {plainTextBeforeMention}
                    </Text>,
                );
            }

            elements.push(
                <TouchableOpacity
                    key={match.index}
                    onPress={() => {
                        onMentionPress ? onMentionPress(mention) : handleUserPress(mention);
                    }}>
                    <Text
                        style={[
                            styles.text,
                            {
                                color: Colors.text,
                                fontSize: computedFontSize,
                                fontFamily: fontFamily,
                            },
                            style,
                        ]}>
                        {`@${mention}`}
                    </Text>
                </TouchableOpacity>,
            );

            lastIndex = mentionRegex.lastIndex;
        }

        const plainTextAfterLastMention = text.substring(lastIndex);
        if (plainTextAfterLastMention) {
            elements.push(
                <Text
                    onLayout={onLayout}
                    numberOfLines={
                        numberOfLines !== undefined ? numberOfLines : undefined
                    }
                    key={lastIndex}
                    style={[
                        styles.text,
                        {
                            color: Colors.text,
                            fontSize: computedFontSize,
                            fontFamily: fontFamily,
                        },
                        style,
                    ]}>
                    {plainTextAfterLastMention}
                </Text>,
            );
        }

        return elements;
    }

    return (
        <View style={[styles.container, style]}>
            {typeof children === 'string' ? (
                renderTextWithMentions(children)
            ) : (
                <Text
                    onLayout={onLayout}
                    numberOfLines={
                        numberOfLines !== undefined ? numberOfLines : undefined
                    }
                    style={[
                        styles.text,
                        {
                            color: Colors.text,
                            fontSize: computedFontSize,
                            fontFamily: fontFamily,
                        },
                        style,
                    ]}>
                    {children}
                </Text>
            )}
        </View>
    );
}

export default CustomText

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    text: {
        textAlign: 'left',
    },
    mention: {
        textAlign: 'left',
    },
})