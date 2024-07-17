import React from 'react';
import colors from '../helpers/Colors'

import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useHistory } from 'react-router-dom';

const SubscriptionOverview = ({ }) => {
  const history = useHistory();
  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: '#2c2c2c' }}>
      <View style={styles.container}>
        <View style={styles.paywall}>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.paywallClose}>
            {/* <FeatherIcon color="#fff" name="x" size={24} /> */}
          </TouchableOpacity>

          <View style={styles.paywallBadge}>
            <Text style={styles.paywallBadgeText}>💎 Try premium</Text>
          </View>

          <Text style={styles.paywallTitle}>Unlock Premium Features</Text>

          <Text style={styles.paywallDescription}>
            CareVoice simplifies medical documentation by transcribing conversations between healthcare providers and patients, generating clinical notes, and coding.
          </Text>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <span className="icon">
                <i className="fas fa-microphone-alt" style={{color: 'white'}}></i>
              </span>
            </View>

            <Text>
              <Text style={{}}>
                Automatically transcribe provider-patient conversations.
              </Text>{' '}
            </Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <span className="icon">
                <i className="fas fa-pencil-alt" style={{color: 'white'}}></i>
              </span>
            </View>

            <Text>
              <Text style={{}}>
                Generate detailed clinical notes from transcriptions.
              </Text>{' '}
            </Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <span className="icon">
                <i className="fas fa-brain" style={{color: 'white'}}></i>
              </span>
            </View>

            <Text>
              <Text style={{}}>
                Automatically generate relevant ICD-10 codes, CPT Codes, medications.
              </Text>{' '}
            </Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <span className="icon">
                <i className="fas fa-tasks" style={{color: 'white'}}></i>
              </span>
            </View>

            <Text>
              <Text style={{}}>
                Generate, create and manage tasks from conversations.
              </Text>{' '}
            </Text>
          </View>

          <View style={styles.paywallFooter}>
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}>
              <View style={styles.btn}>
                <View style={{ width: 31 }} />

                <Text style={styles.btnText}>View Products</Text>

                {/* <FeatherIcon
                  color="#fff"
                  name="arrow-right"
                  size={19}
                  style={{ marginLeft: 12 }} /> */}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                history.push('/subscriptions');
              }}>
              {/* <View style={styles.btnSecondary}>
                <Text style={styles.btnSecondaryText}>
                  Restore purchase
                </Text>
              </View> */}
            </TouchableOpacity>

            <Text style={styles.paywallFooterText}>
              You can manage and cancel your subscription anytime in App Store.
            </Text>
          </View>
        </View>
      </View>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingBottom: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    marginTop: -50,
  },
  /** Paywall */
  paywall: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: 16,
    paddingHorizontal: 16,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  paywallClose: {
    alignSelf: 'flex-end',
    padding: 4,
    marginBottom: 16,
  },
  paywallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#414141',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  paywallBadgeText: {
    color: '#eaeaea',
    fontSize: 15,
    fontWeight: '600',
  },
  paywallTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: colors.darkText,
    marginBottom: 6,
  },
  paywallDescription: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: colors.lightText,
    letterSpacing: 0.3,
    marginBottom: 48,
  },
  paywallFooter: {
    alignSelf: 'stretch',
    marginTop: 'auto',
    color: colors.primary,
  },
  paywallFooterText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '500',
    color: '#9D9D9D',
    textAlign: 'center',
  },
  /** Feature */
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#414141',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    maxWidth: '80%',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    color: '#929497',
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    // borderWidth: 1,
    backgroundColor: colors.primary,
    // borderColor: '#0066FF',
  },
  btnText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#525252',
    borderColor: '#525252',
    marginTop: 12,
  },
  btnSecondaryText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SubscriptionOverview;
