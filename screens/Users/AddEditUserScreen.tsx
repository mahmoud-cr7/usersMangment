import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useToast } from "@/contexts/ToastContext";
import withAuthProtection from "@/hoc/withAuthProtection";
import { useCreateUser, useUpdateUser, useUser } from "@/hooks/useUsers";
import { CreateUserData, UpdateUserData } from "@/services/api";
import { UsersStackParamList } from "../../navigation/UsersStackNavigator";

type AddEditUserScreenNavigationProp = NativeStackNavigationProp<
  UsersStackParamList,
  "AddEditUser"
>;
type AddEditUserScreenRouteProp = RouteProp<UsersStackParamList, "AddEditUser">;

interface UserForm {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  city: string;
  avatar: string;
  birthdate: Date;
}

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "Charlotte",
  "San Francisco",
  "Indianapolis",
  "Seattle",
  "Denver",
  "Washington",
  "Boston",
  "El Paso",
  "Nashville",
  "Detroit",
  "Oklahoma City",
  "Portland",
  "Las Vegas",
  "Memphis",
  "Louisville",
  "Baltimore",
  "Milwaukee",
  "Albuquerque",
  "Tucson",
  "Fresno",
  "Sacramento",
  "Kansas City",
  "Long Beach",
  "Mesa",
  "Atlanta",
  "Colorado Springs",
  "Virginia Beach",
  "Raleigh",
  "Omaha",
  "Miami",
  "Oakland",
  "Minneapolis",
  "Tulsa",
  "Wichita",
  "New Orleans",
  "Arlington",
];

const avatars = [
  "https://avatars.githubusercontent.com/u/44266783",
  "https://avatars.githubusercontent.com/u/5478515",
  "https://avatars.githubusercontent.com/u/42532709",
  "https://avatars.githubusercontent.com/u/41207086",
  "https://avatars.githubusercontent.com/u/10624374",
  "https://avatars.githubusercontent.com/u/27417431",
  "https://avatars.githubusercontent.com/u/94243015",
  "https://avatars.githubusercontent.com/u/23244499",
  "https://avatars.githubusercontent.com/u/78996874",
  "https://avatars.githubusercontent.com/u/46073403",
];

const FormField: React.FC<{
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
}> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = "default",
}) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={[styles.textInput, error && styles.textInputError]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#8E8E93"
      keyboardType={keyboardType}
      autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const SelectField: React.FC<{
  label: string;
  value: string;
  onPress: () => void;
  placeholder: string;
  error?: string;
  icon?: string;
}> = ({ label, value, onPress, placeholder, error, icon }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TouchableOpacity
      style={[styles.selectInput, error && styles.textInputError]}
      onPress={onPress}
    >
      <Text style={[styles.selectText, !value && styles.placeholderText]}>
        {value || placeholder}
      </Text>
      <Ionicons
        name={(icon as any) || "chevron-down"}
        size={20}
        color="#8E8E93"
      />
    </TouchableOpacity>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const AddEditUserScreen: React.FC = () => {
  const navigation = useNavigation<AddEditUserScreenNavigationProp>();
  const route = useRoute<AddEditUserScreenRouteProp>();
  const { userId } = route.params || {};
  const { showToast } = useToast();

  const isEditing = !!userId;

  // API hooks
  const { data: existingUser, isLoading: isLoadingUser } = useUser(
    userId || ""
  );
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const [form, setForm] = useState<UserForm>({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    city: "",
    avatar: avatars[0],
    birthdate: new Date(),
  });

  const [errors, setErrors] = useState<Partial<UserForm>>({});
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Load existing user data when editing
  useEffect(() => {
    if (isEditing && existingUser) {
      setForm({
        username: existingUser.username || "",
        firstname: existingUser.firstname || "",
        lastname: existingUser.lastname || "",
        email: existingUser.email || "",
        phone: existingUser.phone || "",
        city: existingUser.city || "",
        avatar: existingUser.avatar || avatars[0],
        birthdate: existingUser.birthdate
          ? new Date(existingUser.birthdate)
          : new Date(),
      });
    }
  }, [isEditing, existingUser]);

  const updateField = (field: keyof UserForm, value: string | Date) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserForm> = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!form.firstname.trim()) {
      newErrors.firstname = "First name is required";
    }

    if (!form.lastname.trim()) {
      newErrors.lastname = "Last name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showToast({
        type: "error",
        title: "Please fix the errors below",
      });
      return;
    }

    try {
      if (isEditing && userId) {
        const updateData: UpdateUserData = {
          id: userId,
          username: form.username,
          firstname: form.firstname,
          lastname: form.lastname,
          email: form.email,
          phone: form.phone,
          city: form.city,
          avatar: form.avatar,
        };
        await updateUserMutation.mutateAsync(updateData);
        // showToast({
        //   type: "success",
        //   title: "User updated successfully",
        // });
      } else {
        const createData: CreateUserData = {
          username: form.username,
          firstname: form.firstname,
          lastname: form.lastname,
          email: form.email,
          phone: form.phone,
          city: form.city,
          avatar: form.avatar,
        };
        await createUserMutation.mutateAsync(createData);
        // showToast({
        //   type: "success",
        //   title: "User created successfully",
        // });
      }
      navigation.goBack();
    } catch {
      showToast({
        type: "error",
        title: `Failed to ${isEditing ? "update" : "create"} user`,
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const isLoading =
    createUserMutation.isPending || updateUserMutation.isPending;

  if (isLoadingUser && isEditing) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading user...</Text>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{isEditing ? "Edit User" : "Add User"}</Text>
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 80}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.avatarSection}>
              <Text style={styles.sectionTitle}>Profile Picture</Text>
              <TouchableOpacity
                style={styles.avatarContainer}
                onPress={() => setShowAvatarPicker(true)}
              >
                <Image
                  source={{ uri: form.avatar }}
                  style={styles.avatarImage}
                />
                <View style={styles.avatarOverlay}>
                  <Ionicons name="camera" size={24} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <FormField
                label="Username"
                value={form.username}
                onChangeText={(text) => updateField("username", text)}
                placeholder="Enter username"
                error={errors.username}
              />

              <View style={styles.nameRow}>
                <View style={styles.nameField}>
                  <FormField
                    label="First Name"
                    value={form.firstname}
                    onChangeText={(text) => updateField("firstname", text)}
                    placeholder="First name"
                    error={errors.firstname}
                  />
                </View>
                <View style={styles.nameField}>
                  <FormField
                    label="Last Name"
                    value={form.lastname}
                    onChangeText={(text) => updateField("lastname", text)}
                    placeholder="Last name"
                    error={errors.lastname}
                  />
                </View>
              </View>

              <FormField
                label="Email"
                value={form.email}
                onChangeText={(text) => updateField("email", text)}
                placeholder="Enter email address"
                keyboardType="email-address"
                error={errors.email}
              />

              <FormField
                label="Phone"
                value={form.phone}
                onChangeText={(text) => updateField("phone", text)}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                error={errors.phone}
              />

              <SelectField
                label="City"
                value={form.city}
                onPress={() => setShowCityPicker(true)}
                placeholder="Select city"
                error={errors.city}
                icon="location-outline"
              />

              <SelectField
                label="Birth Date"
                value={formatDate(form.birthdate)}
                onPress={() => setShowDatePicker(true)}
                placeholder="Select birth date"
                icon="calendar-outline"
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={form.birthdate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                updateField("birthdate", selectedDate);
              }
            }}
            maximumDate={new Date()}
          />
        )}
      </KeyboardAvoidingView>

      {/* City Picker Modal */}
      <Modal
        visible={showCityPicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCityPicker(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select City</Text>
            <View style={styles.modalSpace} />
          </View>
          <ScrollView style={styles.modalContent}>
            {cities.map((city) => (
              <TouchableOpacity
                key={city}
                style={styles.modalOption}
                onPress={() => {
                  updateField("city", city);
                  setShowCityPicker(false);
                }}
              >
                <Text style={styles.modalOptionText}>{city}</Text>
                {form.city === city && (
                  <Ionicons name="checkmark" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Avatar Picker Modal */}
      <Modal
        visible={showAvatarPicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAvatarPicker(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Avatar</Text>
            <View style={styles.modalSpace} />
          </View>
          <ScrollView style={styles.modalContent}>
            <View style={styles.avatarGrid}>
              {avatars.map((avatar, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.avatarOption,
                    form.avatar === avatar && styles.selectedAvatarOption,
                  ]}
                  onPress={() => {
                    updateField("avatar", avatar);
                    setShowAvatarPicker(false);
                  }}
                >
                  <Image
                    source={{ uri: avatar }}
                    style={styles.avatarOptionImage}
                  />
                  {form.avatar === avatar && (
                    <View style={styles.avatarSelected}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for keyboard
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#8E8E93",
  },
  avatarSection: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  form: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20, // Add bottom margin for keyboard space
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  textInputError: {
    borderColor: "#FF3B30",
  },
  selectInput: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  selectText: {
    fontSize: 16,
    color: "#000000",
  },
  placeholderText: {
    color: "#8E8E93",
  },
  errorText: {
    fontSize: 14,
    color: "#FF3B30",
    marginTop: 4,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalCancelText: {
    fontSize: 16,
    color: "#007AFF",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  modalSpace: {
    width: 60,
  },
  modalContent: {
    flex: 1,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#000000",
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  avatarOption: {
    position: "relative",
  },
  selectedAvatarOption: {
    transform: [{ scale: 0.95 }],
  },
  avatarOptionImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarSelected: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});

export default withAuthProtection(AddEditUserScreen, {
  requireAuth: false,
  blockGuests: true, // Block guests from adding/editing users
});
