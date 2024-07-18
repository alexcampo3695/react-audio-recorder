import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Colors from '../helpers/Colors';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import { useUser } from '../context/UserContext';
import { Glassfy, GlassfyOffering, GlassfySku } from 'capacitor-plugin-glassfy';
import PageLoader from '../pages/LoaderPage';
import { useHistory } from 'react-router-dom';
import { Notyf } from "notyf";
import { API_BASE_URL, APPLE_SECRET } from '../config';

// import FeatherIcon from 'react-native-vector-icons/Feather';


export default function SubscriptionProducts() {
  const [selected, setSelected] = useState<number | null>(null);
  const [offerings, setOfferings] = useState<GlassfyOffering[]>([]);
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const GLASSFY_API_KEY = import.meta.env.VITE_GLASSFY_API_KEY
  const [skuData, setSkuData] = useState<GlassfySku | null>(null);
  const userId = user?.id;
  const history = useHistory();
  const notyf = new Notyf();

  const APPLE_SECRET = import.meta.env.VITE_PROD_BACKEND_URL
  console.log('apple_secret', APPLE_SECRET)

  useEffect(() => {
    const initGlassfy = async () => {
      try {
        setLoading(true);
        await Glassfy.initialize({ apiKey: 'fbe75b0835d54fd3ace820863c2c7855', watcherMode: false });
        const offerings = await Glassfy.offerings();
        console.log('offerings', offerings);
        setOfferings(offerings.all);

        if (offerings.all.length > 0 && offerings.all[0].skus.length > 0) {
          setSelected(0);
          setSkuData(offerings.all[0].skus[0])
        }
      } catch (e) {
        console.error("initialization error", e);
      } finally {
        setLoading(false);
      }
    }

    initGlassfy();
  }, []);

  

  const handlePurchase = async () => {
    if (skuData) {
      try {
        const transaction = await Glassfy.purchaseSku({ sku: skuData });
        await Glassfy.connectCustomSubscriber({ subscriberId: userId || '' });
        history.push('/home')
        notyf.success('Purchase Successful!');
      } catch (e) {
          console.error('Purchase Failed', e);
          notyf.error('Sorry your purchase has failed. Please contact support.');
      }
    }
  }

  const handleRestore = async () => {
    if (userId) {
      try {
        const restoredTransactions = await Glassfy.restorePurchases();
        
        // Extract the relevant data from the restored transactions object
        history.push('/home');
        notyf.success('Restore Successful!');
      } catch (e) {
        console.error('Restore Failed', e);
        notyf.error('Sorry your restore has failed. Please contact support.');
      }
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>💎 Premium Unlimited Access</Text>
        <Text style={styles.subtitle}>
          CareVoice transforms conversations into seamless medical documentation.
          Subscribe now for unlimited access!
        </Text>
      </View>

      <View style={styles.form}>
        <View>
          {offerings.map((offering, offeringIndex) => (
          offering.skus.map((sku, index) => {
            const isActive = selected === index;
            return (
              <TouchableWithoutFeedback
                key={`sku-${offeringIndex}-${index}`}
                onPress={() => {
                  setSelected(index);
                  setSkuData(sku);
                }}
                // type="without-feedback"
              >
                <View
                  style={[
                    styles.radio,
                    isActive
                      ? { borderColor: Colors.primary, backgroundColor: Colors.primaryLighter }
                      : {},
                  ]}>
                  {/* <span className="icon">
                    <i 
                      data-feather={isActive ? "check-circle" : "circle"}
                      color={isActive ? '#F82E08' : '#363636'}
                    >
                    </i>
                  </span> */}
                  {/* <FeatherIcon
                    color={isActive ? '#F82E08' : '#363636'}
                    name={isActive ? 'check-circle' : 'circle'}
                    size={24} /> */}

                  <View style={styles.radioBody}>
                    <View>
                      <Text style={styles.radioLabel}>{sku.product.title}</Text>

                      <Text style={styles.radioText}>
                       {sku.productId === 'care_voice_subscription_monthly_99.99'
                       ? 'Enjoy unlimited usage each month'
                       : 'Enjoy unlimited usage each year'}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.radioPrice,
                        isActive && styles.radioPriceActive,
                      ]}>
                      {'$'}{sku.product.price}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )
            
          })
        ))}
        </View>

        <View>
          <TouchableOpacity
            onPress={() => {
              handlePurchase()
            }}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Continue</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleRestore()
            }}>
            <View style={styles.btnEmpty}>
              <Text style={styles.btnEmptyText}>Restore Purchase</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.formFooterText}>
            Plan renews automatically. You can manage and cancel your
            subscription in App Store.
          </Text>
          <Text style={styles.link} onPress={() => Linking.openURL('https://www.antidote-ai.com/privacy-policy')}>
            Privacy Policy
          </Text>
          <Text style={styles.link} onPress={() => Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}>
            Terms of Use
          </Text>

        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
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
    backgroundColor: Colors.primaryLight,
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
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
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
    borderColor: Colors.primary,
    marginTop: 12,
  },
  btnEmptyText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  link: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    textAlign: 'center',
    marginTop: 12,
  },
});
