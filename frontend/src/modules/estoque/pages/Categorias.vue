<template>
  <div class="categorias">
    <div class="d-flex justify-space-between align-center na-mb-3">
      <h1>Categorias</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" to="/estoque/categorias/nova">
        Nova Categoria
      </v-btn>
    </div>
    
    <base-card>
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Buscar categorias"
        single-line
        hide-details
        class="na-mb-3"
      ></v-text-field>
      
      <v-treeview
        :items="categoriasTree"
        :search="search"
        :open="openCategories"
        item-key="id"
        item-text="nome"
        item-children="subcategorias"
        open-on-click
        dense
        hoverable
        activatable
        :loading="loading"
      >
        <template v-slot:prepend="{ item }">
          <v-icon>{{ item.categoriaPaiId ? 'mdi-tag' : 'mdi-folder' }}</v-icon>
        </template>
        
        <template v-slot:append="{ item }">
          <div class="d-flex">
            <v-btn
              icon
              variant="text"
              color="primary"
              :to="`/estoque/categorias/${item.id}`"
              title="Editar"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="error"
              @click="confirmarExclusao(item)"
              title="Excluir"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-treeview>
    </base-card>
    
    <!-- Dialog de confirmação de exclusão -->
    <base-dialog
      v-model="dialogExclusao"
      title="Confirmar exclusão"
      max-width="400px"
    >
      <p>Deseja realmente excluir a categoria <strong>{{ categoriaSelecionada?.nome }}</strong>?</p>
      <p class="na-mt-2">Esta ação não poderá ser desfeita.</p>
      
      <template #actions>
        <v-btn color="default" variant="text" @click="dialogExclusao = false">
          Cancelar
        </v-btn>
        <v-btn color="error" @click="excluirCategoria" :loading="excluindo">
          Excluir
        </v-btn>
      </template>
    </base-dialog>
    
    <!-- Snackbar para notificações -->
    <base-snackbar
      v-model="snackbar.show"
      :text="snackbar.text"
      :color="snackbar.color"
    ></base-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseDialog from '@/components/BaseDialog.vue'
import BaseSnackbar from '@/components/BaseSnackbar.vue'
import categoriaService, { Categoria } from '../services/categoriaService'

interface CategoriaTree extends Categoria {
  subcategorias: CategoriaTree[];
}

export default defineComponent({
  name: 'Categorias',
  components: {
    BaseCard,
    BaseDialog,
    BaseSnackbar
  },
  setup() {
    const categorias = ref<Categoria[]>([])
    const loading = ref(true)
    const search = ref('')
    const openCategories = ref<number[]>([])
    const dialogExclusao = ref(false)
    const categoriaSelecionada = ref<Categoria | null>(null)
    const excluindo = ref(false)
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })
    
    // Transforma a lista de categorias em uma estrutura de árvore
    const categoriasTree = computed(() => {
      const categoriasPrincipais = categorias.value.filter(c => !c.categoriaPaiId)
      
      const buildTree = (categoria: Categoria): CategoriaTree => {
        const subcategorias = categorias.value.filter(c => c.categoriaPaiId === categoria.id)
        
        return {
          ...categoria,
          subcategorias: subcategorias.length > 0 ? subcategorias.map(buildTree) : []
        }
      }
      
      return categoriasPrincipais.map(buildTree)
    })
    
    // Carrega a lista de categorias
    const carregarCategorias = async () => {
      loading.value = true
      try {
        categorias.value = await categoriaService.listar()
        
        // Abre todas as categorias principais por padrão
        openCategories.value = categorias.value
          .filter(c => !c.categoriaPaiId)
          .map(c => c.id!)
      } catch (error) {
        mostrarNotificacao('Erro ao carregar categorias', 'error')
        console.error(error)
      } finally {
        loading.value = false
      }
    }
    
    // Confirma a exclusão de uma categoria
    const confirmarExclusao = (categoria: Categoria) => {
      categoriaSelecionada.value = categoria
      dialogExclusao.value = true
    }
    
    // Exclui a categoria selecionada
    const excluirCategoria = async () => {
      if (!categoriaSelecionada.value?.id) return
      
      excluindo.value = true
      try {
        await categoriaService.remover(categoriaSelecionada.value.id)
        mostrarNotificacao('Categoria excluída com sucesso')
        dialogExclusao.value = false
        carregarCategorias()
      } catch (error) {
        mostrarNotificacao('Erro ao excluir categoria. Verifique se não há subcategorias ou produtos vinculados.', 'error')
        console.error(error)
      } finally {
        excluindo.value = false
      }
    }
    
    // Exibe uma notificação
    const mostrarNotificacao = (texto: string, cor: string = 'success') => {
      snackbar.value = {
        show: true,
        text: texto,
        color: cor
      }
    }
    
    // Carrega os dados ao montar o componente
    onMounted(() => {
      carregarCategorias()
    })
    
    return {
      categorias,
      categoriasTree,
      loading,
      search,
      openCategories,
      dialogExclusao,
      categoriaSelecionada,
      excluindo,
      snackbar,
      confirmarExclusao,
      excluirCategoria
    }
  }
})
</script>