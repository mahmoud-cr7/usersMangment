import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useToast } from "@/contexts/ToastContext";
import withAuthProtection from "@/hoc/withAuthProtection";
import {
  useCreateUser,
  useUpdateUser,
  useUser,
} from "@/hooks/useUsers";
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
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
  "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
  "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis",
  "Seattle", "Denver", "Washington", "Boston", "El Paso", "Nashville",
  "Detroit", "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville",
  "Baltimore", "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento",
  "Kansas City", "Long Beach", "Mesa", "Atlanta", "Colorado Springs",
  "Virginia Beach", "Raleigh", "Omaha", "Miami", "Oakland", "Minneapolis",
  "Tulsa", "Wichita", "New Orleans", "Arlington"
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

const AddEditUserScreen: React.FC = () => {
  const navigation = useNavigation<AddEditUserScreenNavigationProp>();
  const route = useRoute<AddEditUserScreenRouteProp>();
  const { userId } = route.params || {};
  const { showToast } = useToast();

  const isEditing = !!userId;

  // API hooks
  const { data: existingUser, isLoading: isLoadingUser } = useUser(userId || "");
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
        birthdate: existingUser.birthdate ? new Date(existingUser.birthdate) : new Date(),
      });
    }
  }, [isEditing, existingUser]);

  const updateField = (field: keyof UserForm, value: string | Date) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
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
        title: "Please fix the errors below" 
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
        showToast({ 
          type: "success", 
          title: "User updated successfully" 
        });
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
        showToast({ 
          type: "success", 
          title: "User created successfully" 
        });
      }
      navigation.goBack();
    } catch (error) {
      showToast({ 
        type: "error", 
        title: `Failed to ${isEditing ? "update" : "create"} user` 
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const isLoading = createUserMutation.isPending || updateUserMutation.isPending;

  if (isLoadingUser && isEditing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading user...</Text>
        </View>
      </SafeAreaView>
    );
  }
      ]
    );
  };

  const updateForm = (field: keyof UserForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

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
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <FormField
            label="Name"
            value={form.name}
            onChangeText={(text) => updateForm("name", text)}
            placeholder="Enter full name"
            error={errors.name}
          />

          <FormField
            label="Email"
            value={form.email}
            onChangeText={(text) => updateForm("email", text)}
            placeholder="Enter email address"
            keyboardType="email-address"
            error={errors.email}
          />

          <FormField
            label="Phone"
            value={form.phone}
            onChangeText={(text) => updateForm("phone", text)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            error={errors.phone}
          />

          <FormField
            label="Department"
            value={form.department}
            onChangeText={(text) => updateForm("department", text)}
            placeholder="Enter department"
            error={errors.department}
          />

          <FormField
            label="Role"
            value={form.role}
            onChangeText={(text) => updateForm("role", text)}
            placeholder="Enter role"
            error={errors.role}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isEditing ? "Update User" : "Create User"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  content: {
    flex: 1,
  },
  form: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    borderRadius: 12,
    padding: 16,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  textInputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default withAuthProtection(AddEditUserScreen, {
  requireAuth: false,
  blockGuests: true,
  customGuestTitle: "Edit Access Required",
  customGuestMessage: "Please login to add or edit user information",
});
