import React, { useState } from 'react';
import { Glassfy, GlassfyOffering, GlassfyPermission, GlassfySku } from "capacitor-plugin-glassfy" ;
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

const prices = [
  {
    price: '$99.99',
    label: 'Lifetime',
    description: 'Pay Once - Access Forever',
  },
  { price: '$24.99', label: 'Yearly', description: 'Includes Family Sharing' },
  { price: '$9.99', label: 'Monthly', description: 'Includes Family Sharing' },
];

export default function Example() {
  const [selected, setSelected] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4EFF3' }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            // handle onPress
          }}
          style={styles.headerAction}>
          <FeatherIcon
            color="#F82E08"
            name="arrow-left"
            size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>👑 Premium Access</Text>

        <Text style={styles.subtitle}>
          Boost your productivity with premium tools and personalized features.
          Subscribe now for unlimited access!
        </Text>
      </View>

      <View style={styles.form}>
        <View>
          {prices.map((item, index) => {
            const isActive = selected === index;
            return (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => setSelected(index)}
                // type="without-feedback"
              >
                <View
                  style={[
                    styles.radio,
                    isActive
                      ? { borderColor: '#F82E08', backgroundColor: '#feeae6' }
                      : {},
                  ]}>
                  <FeatherIcon
                    color={isActive ? '#F82E08' : '#363636'}
                    name={isActive ? 'check-circle' : 'circle'}
                    size={24} />

                  <View style={styles.radioBody}>
                    <View>
                      <Text style={styles.radioLabel}>{item.label}</Text>

                      <Text style={styles.radioText}>{item.description}</Text>
                    </View>

                    <Text
                      style={[
                        styles.radioPrice,
                        isActive && styles.radioPriceActive,
                      ]}>
                      {item.price}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>

        <View>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Continue</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}>
            <View style={styles.btnEmpty}>
              <Text style={styles.btnEmptyText}>Restore Purchase</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.formFooterText}>
            Plan renews automatically. You can manage and cancel your
            subscription in App Store.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#181818',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: '#889797',
  },
  /** Header */
  header: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffdada',
    marginBottom: 16,
  },
  /** Form */
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingBottom: 24,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  formFooterText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
  },
  /** Radio */
  radio: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderWidth: 2,
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderRadius: 24,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  radioBody: {
    paddingLeft: 10,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  radioLabel: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1d1d1d',
  },
  radioText: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '500',
    color: '#889797',
  },
  radioPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d1d1d',
  },
  radioPriceActive: {
    transform: [
      {
        scale: 1.2,
      },
    ],
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    backgroundColor: '#F82E08',
    borderColor: '#F82E08',
  },
  btnText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  btnEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    borderColor: '#F82E08',
    marginTop: 12,
  },
  btnEmptyText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 'bold',
    color: '#F82E08',
  },
});