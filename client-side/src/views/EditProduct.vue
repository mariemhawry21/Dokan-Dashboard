<template>
  <v-container class="mb-8 pa-4 rounded-lg elevation-2">
    <v-form ref="form" @submit.prevent="updateProduct">
      <h3 class="text-h6 mb-2">{{ t('general_information') }}</h3>
      <v-text-field
        v-model="editedProduct.Product"
        :rules="[rules.required]"
    :label="t('product_name')"
      ></v-text-field>

      <v-textarea
        v-model="editedProduct.Description"
       :label="t('description')"
      ></v-textarea>
     <h3 class="text-h6 mb-2">{{ t('dimensions') }}</h3>
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="editedProduct.dimensions.width"
          :label="t('width')"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="editedProduct.dimensions.height"
            :label="t('height')"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="editedProduct.dimensions.depth"
          :label="t('depth')"
            type="number"
          ></v-text-field>
        </v-col>
      </v-row>
    <h3 class="text-h6 mb-2">{{ t('category') }}</h3>
      <v-select
        v-model="editedProduct.ProductCategory"
        :items="categoriesList"
        item-value="_id"
        item-title="name"
        :rules="[rules.required]"
        :label="t('product_category')"
      ></v-select>

     <h3 class="text-h6 mb-2">{{ t('pricing') }}</h3>

      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="editedProduct.BasePrice"
            :rules="[rules.required]"
            :label="t('price')"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="editedProduct.DiscountType"
            :items="['Percentage', 'Fixed']"
            :label="t('discount_type')"
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="editedProduct.DiscountValue"
           :label="t('discount_value')"
            type="number"
          ></v-text-field>
        </v-col>
      </v-row>
       <h3 class="text-h6 mb-2">{{ t('inventory') }}</h3>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="editedProduct.Quantity"
            :rules="[rules.required]"
    :label="t('quantity')"
            type="number"
          ></v-text-field>
        </v-col>
      </v-row>

      <div>
        <div
          v-for="(color, index) in editedProduct.colors"
          :key="'color_' + index"
        >
          <h3 class="text-h6 mb-4">{{ t('color_n', { n: index + 1 }) }}</h3>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="color.name"
                :items="colorsList"
                item-value="name"
                item-title="name"
                 :label="t('select_color_name')"
                :rules="[rules.required]"
                @change="updateColorHex(index)"
                class="mb-4"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="color.hex"
                 :label="t('color_hex_value')"
                readonly
                class="mb-4"
              >
                <template v-slot:append-inner>
                  <div
                    :style="{
                      width: '30px',
                      height: '30px',
                      borderRadius: '4px',
                      backgroundColor: color.hex,
                      border: '1px solid #ccc',
                      marginRight: '8px'
                    }"
                  ></div>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="color.quantity"
               :label="t('color_quantity')"
                type="number"
                :rules="[rules.required]"
                class="mb-4"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="color.sku"
                :label="t('color_sku')"
                :rules="[rules.required]"
                class="mb-6"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex justify-end">
              <v-btn
                v-if="editedProduct.colors.length > 1"
                @click="removeColor(index)"
                color="primary"
                class="my-2 text-error"
              >
                 {{ t('remove_color') }}
              </v-btn>
            </v-col>
          </v-row>

          <h5 class="text-h6 mb-2">{{ t('images_for_color_n', { n: index + 1 }) }}</h5>
          <v-row dense class="mb-4">
            <v-col
              v-for="(image, imgIndex) in color.uploadedImages"
              :key="'img_' + index + '_' + imgIndex"
              cols="12"
              sm="6"
              md="3"
            >
              <v-card
                class="pa-2 d-flex flex-column align-center"
                elevation="1"
              >
                <v-img
                  :src="image.imageUrl"
                  height="100"
                  width="100"
                  class="rounded mb-2"
                  cover
                ></v-img>

                <span
                  class="text-caption text-truncate text-center mb-2"
                  style="max-width: 100px"
                >
                  {{ image.imageUrl.split('/').pop() }}
                </span>

                <div class="d-flex justify-center gap-2">
                  <v-btn
                    icon
                    size="small"
                    color="primary"
                    @click="startImageChange(index, imgIndex)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </div>

                <input
                  v-if="color.changingImageIndex === imgIndex"
                  type="file"
                  accept="image/*"
                  @change="
                    handleImageChange(index, imgIndex, $event.target.files)
                  "
                  class="mt-2"
                />
                <!-- input image  -->
              </v-card>
            </v-col>
          </v-row>

          <v-divider class="my-6"></v-divider>
          <!-- image upload -->

          <!--  -->
        </div>
      </div>
      <v-row>
        <v-col>
          <v-btn class="mt-4" type="submit" color="secondary"
            >{{ t('update_product') }}</v-btn
          >
          <v-btn class="mt-4 ml-2" @click="goBack" color="primary"
            >{{ t('cancel') }}</v-btn
          >
        </v-col>
        <v-col class="d-flex justify-end">
          <v-btn
            @click="addColor"
            color="secondary"
            variant="elevated"
            class="mb-6"
          >
           {{ t('add_color') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
 const { t, locale } = useI18n()
  import { useI18n } from 'vue-i18n'
  import { ref, onMounted, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useProductStore } from '../store/product'
  import axios from 'axios'
  import { api } from '../store/product'
  const productImages = ref([])
  const productImagePreviews = ref([])

  const router = useRouter()
  const route = useRoute()
  const productStore = useProductStore()
  const form = ref(null)
  const categoriesList = ref([])
  const colorsList = ref([
    { name: 'Black', hex: '#000000' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Green', hex: '#008000' },
    { name: 'Cream', hex: '#FFFDD0' },
    { name: 'Lavender', hex: '#E6E6FA' },
    { name: 'walnut', hex: '#8B4513' },
    { name: 'Olive', hex: '#808000' },
    { name: 'Dark Brown', hex: '#5C4033' },
    { name: 'Light Blue', hex: '#ADD8E6' },
    { name: 'Dark Blue', hex: '#00008B' },
    { name: 'Graphite Black', hex: '#1C1C1C' },
    { name: 'Navy Blue', hex: '#000080' },
    { name: 'Light Gray', hex: '#D3D3D3' },
    { name: 'Dark Gray', hex: '#A9A9A9' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Green', hex: '#008000' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Turquoise', hex: '#40E0D0' },
    { name: 'Light Green', hex: '#90EE90' },
    { name: 'Dark Green', hex: '#006400' },
    { name: 'Light Grey', hex: '#D3D3D3' },
    { name: 'Dark Grey', hex: '#A9A9A9' },
    { name: 'Ivory', hex: '#FFFFF0' },
    { name: 'Cream', hex: '#FFFDD0' },
    { name: 'Burgundy', hex: '#800020' },
    { name: 'Olive', hex: '#808000' },
    { name: 'Mustard', hex: '#FFDB58' },
    { name: 'Coral', hex: '#FF7F50' },
    { name: 'Salmon', hex: '#FA8072' },
    { name: 'Lavender', hex: '#E6E6FA' },
    { name: 'Peach', hex: '#FFDAB9' },
    { name: 'walnut', hex: '#8B4513' },
    { name: 'White Stained', hex: '#F5F5F5' },
    { name: 'Pine', hex: '#F0E68C' },
    { name: 'Oak', hex: '#8B4513' }
  ])

  const productId = ref(route.params.id)
  console.log('Product ID اللي بيتحاول يتجاب:', productId.value)
  const editedProduct = ref({
    Product: '',
    Description: '',
    ProductCategory: [],
    ProductTags: '',
    ProductStatus: 'Draft',
    BasePrice: null,
    DiscountType: null,
    DiscountValue: null,
    SKU: '',
    Quantity: 0,
    dimensions: {
      width: null,
      height: null,
      depth: null
    },
    colors: [
      {
        name: '',
        hex: '',
        quantity: null,
        sku: '',
        images: [],
        uploadedImages: [],
        newlyUploadedImages: [], // هنا هنخزن معلومات الصور الجديدة اللي اترفت
        localPreviewUrls: [],
        changingImageIndex: -1
      }
    ]
  })

  const rules = ref({
    required: (value) => !!value || 'Required.'
  })

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.categories)
      ) {
        categoriesList.value = response.data.data.categories
        console.log('Categories fetched:', categoriesList.value)
      } else {
        console.error(
          'Error: Categories data is not in the expected format:',
          response.data
        )
        categoriesList.value = []
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      categoriesList.value = []
    }
  }
  const loadProductDetails = async () => {
    console.log('loadProductDetails تم استدعاؤها')
    try {
      console.log(
        'القيمة الأولية لـ editedProduct.Quantity:',
        editedProduct.value.Quantity
      ) // أو quantity
      const response = await api.get(`/products/${productId.value}`)
      console.log(
        'Full Product Details Response:',
        JSON.stringify(response.data, null, 2)
      )
      if (response.data && response.data.data && response.data.data.product) {
        const productData = response.data.data.product
        console.log(
          'قيمة productData.totalQuantity من الـ API:',
          productData.totalQuantity
        )

        editedProduct.value = {
          Product: productData.name || '',
          Description: productData.subtitle || '',
          ProductCategory: productData.categories || [],
          ProductTags: productData.tags ? productData.tags.join(', ') : '',
          ProductStatus: productData.status || 'Draft',
          BasePrice: productData.price !== undefined ? productData.price : null,
          DiscountType: editedProduct.value.DiscountType || null,
          DiscountValue:
            productData.sale !== undefined ? productData.sale : null,
          SKU:
            productData.colors && productData.colors[0]
              ? productData.colors[0].sku
              : '',
          Quantity:
            productData.totalQuantity !== undefined
              ? productData.totalQuantity
              : null,

          dimensions: {
            width: productData.additionalInformation?.dimensions?.width || null,
            height:
              productData.additionalInformation?.dimensions?.height || null,
            depth: productData.additionalInformation?.dimensions?.depth || null
          },
          colors: productData.colors
            ? productData.colors.map((color) => {
                return {
                  name: color.name || '',
                  hex: color.hex || '',
                  quantity:
                    color.quantity !== undefined ? color.quantity : null,
                  sku: color.sku || '',
                  images: color.images
                    ? color.images.map((img) => ({
                        imageUrl: img.imageUrl,
                        publicId: img.publicId,
                        _id: img._id
                      }))
                    : [],
                  uploadedImages: color.images
                    ? color.images.map((img) => ({
                        imageUrl: img.imageUrl,
                        publicId: img.publicId,
                        _id: img._id
                      }))
                    : [],
                  localPreviewUrls: color.images
                    ? color.images.map((img) => img.imageUrl)
                    : [],
                  changingImageIndex: -1,
                  newlyUploadedImages: [] // **التأكيد على الإضافة هنا**
                }
              })
            : [
                {
                  name: '',
                  hex: '',
                  quantity: null,
                  sku: '',
                  images: [],
                  uploadedImages: [],
                  localPreviewUrls: [],
                  changingImageIndex: -1,
                  newlyUploadedImages: []
                }
              ] // وبرضه هنا للـ initial state
        }
        console.log(
          'editedProduct.value.colors after load:',
          editedProduct.value.colors
        )
        console.log(
          'قيمة editedProduct.Quantity بعد التعيين:',
          editedProduct.value.Quantity
        ) // <---- الـ console.log هنا بعد تعريف الـ editedProduct.value كله
      } else {
        console.error('Product not found with ID:', productId.value)
        router.push('/products')
      }
    } catch (error) {
      console.error('Error loading product details:', error)
      router.push('/products')
    }
  }

  onMounted(async () => {
    await fetchCategories()
    await loadProductDetails()
  })

  const updateColorHex = (index) => {
    const selectedColor = colorsList.value.find(
      (c) => c.name === editedProduct.value.colors[index].name
    )
    if (selectedColor) {
      editedProduct.value.colors[index].hex = selectedColor.hex
    } else if (!editedProduct.value.colors[index].name) {
      editedProduct.value.colors[index].hex = ''
    }
  }

  const addColor = () => {
    editedProduct.value.colors.push({
      name: '',
      hex: '',
      quantity: null,
      sku: '',
      images: [],
      uploadedImages: [],
      localPreviewUrls: [],
      changingImageIndex: -1
    })
  }

  const removeColor = (index) => {
    editedProduct.value.colors.splice(index, 1)
  }

  const startImageChange = (colorIndex, imageIndex) => {
    editedProduct.value.colors[colorIndex].changingImageIndex = imageIndex
  }

  const handleImageChange = async (colorIndex, imageIndex, files) => {
    if (!files || files.length === 0) {
      editedProduct.value.colors[colorIndex].changingImageIndex = -1
      return
    }

    const file = files[0]
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await axios.post(
        `http://localhost:5000/api/${editedProduct.value.Product.replace(/\s+/g, '-').toLowerCase()}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      if (response.data.data?.length > 0) {
        const newImage = response.data.data[0]
        const oldImage =
          editedProduct.value.colors[colorIndex].uploadedImages[imageIndex]

        // Update the image data with proper structure
        editedProduct.value.colors[colorIndex].uploadedImages[imageIndex] = {
          ...newImage,
          _id: oldImage._id, // Keep original ID
          _oldPublicId: oldImage.publicId // Mark old publicId for deletion
        }

        // Also update the images array that will be sent to backend
        editedProduct.value.colors[colorIndex].images[imageIndex] = {
          _id: oldImage._id,
          public_id: newImage.publicId,
          url: newImage.imageUrl,
          _oldPublicId: oldImage.publicId
        }
      }
    } catch (error) {
      console.error('Image upload failed:', error)
    } finally {
      editedProduct.value.colors[colorIndex].changingImageIndex = -1
    }
  }
  // handle image upload
  const handleImageUpload = async (colorIndex, files) => {
    if (files && files.length > 0) {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append('image', files[i])
      }

      const productNameForFolder = editedProduct.value.Product.replace(
        /\s+/g,
        '-'
      ).toLowerCase()
      const uploadUrl = `http://localhost:5000/api/${productNameForFolder}`

      try {
        const response = await axios.post(uploadUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        if (response.data.data && Array.isArray(response.data.data)) {
          response.data.data.forEach((imageData) => {
            if (imageData.publicId && imageData.imageUrl) {
              // هنا بنخزن معلومات الصورة الجديدة
              editedProduct.value.colors[colorIndex].newlyUploadedImages.push({
                public_id: imageData.publicId,
                url: imageData.imageUrl
              })
              // ممكن نضيفها للـ uploadedImages للعرض الفوري لو محتاجين
              editedProduct.value.colors[colorIndex].uploadedImages.push(
                imageData
              )
              console.log('تم رفع صورة جديدة:', imageData)
            } else {
              console.error(
                'Error uploading image - no publicId in image data:',
                imageData
              )
            }
          })
          console.log(
            'newlyUploadedImages دلوقتي:',
            editedProduct.value.colors[colorIndex].newlyUploadedImages
          )
        } else {
          console.error(
            'Error uploading image - unexpected response data:',
            response.data
          )
        }
      } catch (error) {
        console.error('Error uploading image to gallery:', error)
      }
    }
  }

  const removeColorImage = (colorIndex, imageIndex) => {
    editedProduct.value.colors[colorIndex].uploadedImages.splice(imageIndex, 1)
    editedProduct.value.colors[colorIndex].images.splice(imageIndex, 1)
  }
  const updateProduct = async () => {
    const { valid } = await form.value.validate()
    if (valid) {
      
      try {
        const formData = new FormData()

        // Add basic product info
        formData.append('name', editedProduct.value.Product)
        formData.append('subtitle', editedProduct.value.Description || '')
        formData.append('price', editedProduct.value.BasePrice)

        // Add categories
        editedProduct.value.ProductCategory.forEach((cat) => {
          formData.append('categories', cat._id || cat)
        })

        // Prepare colors data
        const colorsData = editedProduct.value.colors.map((color) => {
          const colorObj = {
            name: color.name,
            hex: color.hex,
            quantity: color.quantity,
            sku: color.sku,
            images: color.uploadedImages.map((img) => ({
              _id: img._id, // Keep existing ID
              public_id: img.publicId, // Current publicId
              url: img.imageUrl, // Current URL
              ...(img._oldPublicId ? { _oldPublicId: img._oldPublicId } : {}) // Only include if exists
            }))
          }

          // Add newly uploaded images
          if (
            color.newlyUploadedImages &&
            color.newlyUploadedImages.length > 0
          ) {
            color.newlyUploadedImages.forEach((newImg) => {
              colorObj.images.push({
                public_id: newImg.public_id,
                url: newImg.url
              })
            })
          }

          return colorObj
        })

        // Stringify colors data and append to formData
        formData.append('colors', JSON.stringify(colorsData))

        // Add dimensions
        formData.append(
          'dimensions',
          JSON.stringify(editedProduct.value.dimensions)
        )

        console.log('Sending update with:', Array.from(formData.entries()))

        await productStore.updateProduct(route.params.id, formData)
        router.push('/products')
      } catch (error) {
        console.error('Error updating product:', error)
      }
    }
  }

  watch(
    () => editedProduct.value.colors,
    (newColors) => {
      newColors.forEach((color) => {
        const selectedColor = colorsList.value.find(
          (c) => c.name === color.name
        )
        if (selectedColor) {
          color.hex = selectedColor.hex
        } else if (!color.name) {
          color.hex = ''
        }
      })
    },
    { deep: true }
  )

  const goBack = () => {
    router.go(-1)
  }
</script>

<style scoped>
  .form-section {
    background-color: #f9f9f9;
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 24px;
    border: 1px solid #eee;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 6px;
    margin-bottom: 16px;
  }

  .v-text-field,
  .v-select,
  .v-textarea,
  .v-file-input {
    margin-bottom: 16px;
  }

  .v-btn {
    border-radius: 8px;
    text-transform: none;
    font-weight: 500;
    padding: 10px 20px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .v-btn + .v-btn {
    margin-left: 12px;
  }

  .image-preview {
    position: relative;
  }

  .image-preview .v-btn {
    position: absolute;
    top: -10px;
    right: -10px;
  }

  @media (max-width: 600px) {
    h3 {
      font-size: 16px;
    }

    .v-btn {
      width: 100%;
      margin-bottom: 8px;
    }

    .v-btn + .v-btn {
      margin-left: 0;
    }
  }
</style>
